import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:internship_app/core/storage/auth_storage.dart';
import 'package:internship_app/models/internship_model.dart';

class InternshipPageResult {
  final List<InternshipModel> items;
  final int totalPages;
  final int totalCount;

  InternshipPageResult({
    required this.items,
    required this.totalPages,
    required this.totalCount,
  });
}

class InternshipService {
  static const _base = 'https://livesite-backend-74ut.onrender.com';

  Future<Map<String, String>> _headers() async {
    final token = await AuthStorage.getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  /// Fetches a single page from `/student/internships?page=`.
  ///
  /// The backend returns the internship list as an object with numeric
  /// string keys (e.g. `{"0": {...}, "1": {...}, "totalPages": 6,
  /// "numOfInternships": 47}`) rather than a plain JSON array, so entries
  /// are picked out by numeric key and sorted by index.
  Future<InternshipPageResult> getInternshipsPage({int page = 1}) async {
    final res = await http.get(
      Uri.parse('$_base/student/internships?page=$page'),
      headers: await _headers(),
    );
    if (res.statusCode != 200) {
      throw 'Failed to load internships (${res.statusCode})';
    }
    final body = jsonDecode(res.body);

    List rawItems;
    int totalPages = 1;
    int totalCount = 0;

    if (body is List) {
      rawItems = body;
      totalCount = rawItems.length;
    } else if (body is Map) {
      totalPages = (body['totalPages'] as num?)?.toInt() ?? 1;
      totalCount = (body['numOfInternships'] as num?)?.toInt() ?? 0;
      final listField = body['internships'] ?? body['data'];
      if (listField is List) {
        rawItems = listField;
      } else {
        final numericEntries = body.entries
            .where((e) => int.tryParse(e.key.toString()) != null)
            .toList()
          ..sort((a, b) =>
              int.parse(a.key.toString()).compareTo(int.parse(b.key.toString())));
        rawItems = numericEntries.map((e) => e.value).toList();
      }
    } else {
      rawItems = [];
    }

    final items = rawItems
        .map((e) => InternshipModel.fromJson(e as Map<String, dynamic>))
        .toList();

    return InternshipPageResult(
      items: items,
      totalPages: totalPages,
      totalCount: totalCount == 0 ? items.length : totalCount,
    );
  }

  /// Fetches every page and returns the combined internship list.
  Future<List<InternshipModel>> getAllInternships() async {
    final first = await getInternshipsPage(page: 1);
    final all = [...first.items];
    for (var page = 2; page <= first.totalPages; page++) {
      final next = await getInternshipsPage(page: page);
      all.addAll(next.items);
    }
    return all;
  }
}
