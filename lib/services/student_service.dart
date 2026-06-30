import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:internship_app/core/storage/auth_storage.dart';
import 'package:internship_app/models/student_profile_model.dart';

class StudentService {
  static const _base = 'https://livesite-backend-74ut.onrender.com';

  // ── Auth helpers ─────────────────────────────────────────────────────────────
  Future<Map<String, String>> _headers() async {
    final token = await AuthStorage.getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<String?> get _studentId => AuthStorage.getStudentId();

  // ── Login ─────────────────────────────────────────────────────────────────────
  /// Returns the full response body map on success, throws on failure.
  Future<Map<String, dynamic>> loginStudent(
      String email, String password) async {
    final res = await http.post(
      Uri.parse('$_base/student/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    final body = jsonDecode(res.body) as Map<String, dynamic>;
    if (res.statusCode != 200 && res.statusCode != 201) {
      throw body['message'] ?? 'Login failed';
    }
    return body;
  }

  // ── Profile picture ───────────────────────────────────────────────────────────
  Future<String> getProfilePictureUrl() async {
    final id = await _studentId;
    if (id == null) return '';
    return '$_base/student/get-picture/$id';
  }

  Future<bool> uploadProfilePicture(List<int> bytes, String filename) async {
    final id = await _studentId;
    if (id == null) return false;
    final token = await AuthStorage.getToken();
    final request = http.MultipartRequest(
      'POST',
      Uri.parse('$_base/student/upload-picture/$id'),
    );
    if (token != null) request.headers['Authorization'] = 'Bearer $token';
    request.files.add(http.MultipartFile.fromBytes('picture', bytes,
        filename: filename));
    final res = await request.send();
    return res.statusCode == 200 || res.statusCode == 201;
  }

  // ── Save info fields ──────────────────────────────────────────────────────────
  Future<bool> saveLocation(String location) async {
    final id = await _studentId;
    if (id == null) return false;
    final res = await http.put(
      Uri.parse('$_base/student/api/$id/save-location'),
      headers: await _headers(),
      body: jsonEncode({'location': location}),
    );
    if (res.statusCode == 200 || res.statusCode == 201) {
      _persistStudentFromBody(res.body);
      return true;
    }
    return false;
  }

  Future<bool> saveExperience(String experience) async {
    final id = await _studentId;
    if (id == null) return false;
    final res = await http.put(
      Uri.parse('$_base/student/api/$id/save-exp'),
      headers: await _headers(),
      body: jsonEncode({'yearsOfExp': experience}),
    );
    if (res.statusCode == 200 || res.statusCode == 201) {
      _persistStudentFromBody(res.body);
      return true;
    }
    return false;
  }

  Future<bool> saveGender(String gender) async {
    final id = await _studentId;
    if (id == null) return false;
    final res = await http.put(
      Uri.parse('$_base/student/api/$id/save-gender'),
      headers: await _headers(),
      body: jsonEncode({'gender': gender}),
    );
    if (res.statusCode == 200 || res.statusCode == 201) {
      _persistStudentFromBody(res.body);
      return true;
    }
    return false;
  }

  /// Parses `{student: {...}}` from a PUT response body and persists all fields.
  Future<void> _persistStudentFromBody(String responseBody) async {
    try {
      final json = jsonDecode(responseBody) as Map<String, dynamic>;
      final student = json['student'] as Map<String, dynamic>?;
      if (student != null) {
        await AuthStorage.saveStudentFromResponse(student);
      }
    } catch (_) {}
  }

  /// Fetches basic student profile and persists name/email.
  /// Tries education endpoint first (may embed student info), then falls
  /// back to calling save-location with the current stored value so the
  /// server returns the student object.
  Future<void> fetchAndPersistStudentProfile() async {
    final id = await _studentId;
    if (id == null) return;

    // Attempt 1: education endpoint (may return {student, education})
    try {
      final res = await http.get(
        Uri.parse('$_base/student/profile/$id/education'),
        headers: await _headers(),
      );
      if (res.statusCode == 200) {
        final json = jsonDecode(res.body);
        if (json is Map && json['student'] != null) {
          await AuthStorage.saveStudentFromResponse(
              json['student'] as Map<String, dynamic>);
          final name = await AuthStorage.getName();
          if (name != null && name.isNotEmpty) return;
        }
      }
    } catch (_) {}

    // Attempt 2: re-save location with the stored value to get student back
    try {
      final storedLoc = await AuthStorage.getLocation();
      final res = await http.put(
        Uri.parse('$_base/student/api/$id/save-location'),
        headers: await _headers(),
        body: jsonEncode({'location': storedLoc ?? ''}),
      );
      if (res.statusCode == 200 || res.statusCode == 201) {
        await _persistStudentFromBody(res.body);
      }
    } catch (_) {}
  }

  // ── Resume ────────────────────────────────────────────────────────────────────
  Future<bool> uploadResume(List<int> bytes, String filename) async {
    final id = await _studentId;
    if (id == null) return false;
    final token = await AuthStorage.getToken();
    final request = http.MultipartRequest(
      'POST',
      Uri.parse('$_base/student/resume/$id'),
    );
    if (token != null) request.headers['Authorization'] = 'Bearer $token';
    request.files.add(
        http.MultipartFile.fromBytes('resume', bytes, filename: filename));
    final res = await request.send();
    return res.statusCode == 200 || res.statusCode == 201;
  }

  Future<bool> deleteResume() async {
    final id = await _studentId;
    if (id == null) return false;
    final res = await http.delete(
      Uri.parse('$_base/student/resume/$id'),
      headers: await _headers(),
    );
    return res.statusCode == 200 || res.statusCode == 201;
  }

  Future<ResumeModel?> getResume() async {
    final id = await _studentId;
    if (id == null) return null;
    final res = await http.get(
      Uri.parse('$_base/student/resume/$id'),
      headers: await _headers(),
    );
    if (res.statusCode != 200) return null;
    final body = jsonDecode(res.body);
    if (body is Map && body['resume'] != null) {
      return ResumeModel.fromJson(body['resume'] as Map<String, dynamic>);
    }
    if (body is Map && body['fileName'] != null) {
      return ResumeModel.fromJson(body as Map<String, dynamic>);
    }
    return null;
  }

  // ── Education ─────────────────────────────────────────────────────────────────
  Future<List<EducationModel>> getEducation() async {
    final id = await _studentId;
    if (id == null) return [];
    final res = await http.get(
      Uri.parse('$_base/student/profile/$id/education'),
      headers: await _headers(),
    );
    if (res.statusCode != 200) return [];
    final body = jsonDecode(res.body);
    final list = body is List
        ? body
        : (body['education'] ?? body['data'] ?? []) as List;
    return list
        .map((e) => EducationModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<bool> addEducation(Map<String, dynamic> data) async {
    final id = await _studentId;
    if (id == null) return false;
    final res = await http.post(
      Uri.parse('$_base/student/profile/$id/education'),
      headers: await _headers(),
      body: jsonEncode(data),
    );
    return res.statusCode == 200 || res.statusCode == 201;
  }

  Future<bool> deleteEducation(int index) async {
    final id = await _studentId;
    if (id == null) return false;
    final res = await http.delete(
      Uri.parse('$_base/student/profile/$id/education/$index'),
      headers: await _headers(),
    );
    return res.statusCode == 200 || res.statusCode == 201;
  }

  // ── Work Experience ───────────────────────────────────────────────────────────
  Future<List<WorkExperienceModel>> getWorkExperience() async {
    final id = await _studentId;
    if (id == null) return [];
    final res = await http.get(
      Uri.parse('$_base/student/profile/$id/work-experience'),
      headers: await _headers(),
    );
    if (res.statusCode != 200) return [];
    final body = jsonDecode(res.body);
    final list = body is List
        ? body
        : (body['workExperience'] ?? body['data'] ?? []) as List;
    return list
        .map((e) => WorkExperienceModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<bool> deleteWorkExperience(int index) async {
    final id = await _studentId;
    if (id == null) return false;
    final res = await http.delete(
      Uri.parse('$_base/student/profile/$id/work-experience/$index'),
      headers: await _headers(),
    );
    return res.statusCode == 200 || res.statusCode == 201;
  }

  // ── Certificates ──────────────────────────────────────────────────────────────
  Future<List<CertificateModel>> getCertificates() async {
    final id = await _studentId;
    if (id == null) return [];
    final res = await http.get(
      Uri.parse('$_base/student/profile/$id/certificates'),
      headers: await _headers(),
    );
    if (res.statusCode != 200) return [];
    final body = jsonDecode(res.body);
    final list = body is List
        ? body
        : (body['certificates'] ?? body['data'] ?? []) as List;
    return list
        .map((e) => CertificateModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<bool> deleteCertificate(int index) async {
    final id = await _studentId;
    if (id == null) return false;
    final res = await http.delete(
      Uri.parse('$_base/student/profile/$id/certificates/$index'),
      headers: await _headers(),
    );
    return res.statusCode == 200 || res.statusCode == 201;
  }

  // ── Personal Projects ─────────────────────────────────────────────────────────
  Future<List<ProjectModel>> getProjects() async {
    final id = await _studentId;
    if (id == null) return [];
    final res = await http.get(
      Uri.parse('$_base/student/profile/$id/personal-projects'),
      headers: await _headers(),
    );
    if (res.statusCode != 200) return [];
    final body = jsonDecode(res.body);
    final list = body is List
        ? body
        : (body['projects'] ?? body['personalProjects'] ?? body['data'] ?? [])
            as List;
    return list
        .map((e) => ProjectModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<bool> addProject(Map<String, dynamic> data) async {
    final id = await _studentId;
    if (id == null) return false;
    final res = await http.post(
      Uri.parse('$_base/student/profile/$id/personal-projects'),
      headers: await _headers(),
      body: jsonEncode(data),
    );
    return res.statusCode == 200 || res.statusCode == 201;
  }

  Future<bool> deleteProject(int index) async {
    final id = await _studentId;
    if (id == null) return false;
    final res = await http.delete(
      Uri.parse('$_base/student/profile/$id/personal-projects/$index'),
      headers: await _headers(),
    );
    return res.statusCode == 200 || res.statusCode == 201;
  }

  // ── Skills ────────────────────────────────────────────────────────────────────
  Future<List<SkillModel>> getSkills() async {
    final id = await _studentId;
    if (id == null) return [];
    final res = await http.get(
      Uri.parse('$_base/student/profile/$id/skills'),
      headers: await _headers(),
    );
    if (res.statusCode != 200) return [];
    final body = jsonDecode(res.body);
    final list = body is List
        ? body
        : (body['skills'] ?? body['data'] ?? []) as List;
    return list
        .map((e) => SkillModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<bool> addSkill(Map<String, dynamic> data) async {
    final id = await _studentId;
    if (id == null) return false;
    final res = await http.post(
      Uri.parse('$_base/student/profile/$id/skills'),
      headers: await _headers(),
      body: jsonEncode(data),
    );
    return res.statusCode == 200 || res.statusCode == 201;
  }

  Future<bool> addWorkExperience(Map<String, dynamic> data) async {
    final id = await _studentId;
    if (id == null) return false;
    final res = await http.post(
      Uri.parse('$_base/student/profile/$id/work-experience'),
      headers: await _headers(),
      body: jsonEncode(data),
    );
    return res.statusCode == 200 || res.statusCode == 201;
  }

  Future<bool> addCertificate(Map<String, dynamic> data) async {
    final id = await _studentId;
    if (id == null) return false;
    final res = await http.post(
      Uri.parse('$_base/student/profile/$id/certificates'),
      headers: await _headers(),
      body: jsonEncode(data),
    );
    return res.statusCode == 200 || res.statusCode == 201;
  }

  Future<bool> addPortfolioLink(Map<String, dynamic> data) async {
    final id = await _studentId;
    if (id == null) return false;
    final res = await http.post(
      Uri.parse('$_base/student/profile/$id/portfolioLinks'),
      headers: await _headers(),
      body: jsonEncode(data),
    );
    return res.statusCode == 200 || res.statusCode == 201;
  }

  Future<bool> deleteSkill(int index) async {
    final id = await _studentId;
    if (id == null) return false;
    final res = await http.delete(
      Uri.parse('$_base/student/profile/$id/skills/$index'),
      headers: await _headers(),
    );
    return res.statusCode == 200 || res.statusCode == 201;
  }

  // ── Portfolio Links ───────────────────────────────────────────────────────────
  Future<List<PortfolioLinkModel>> getPortfolioLinks() async {
    final id = await _studentId;
    if (id == null) return [];
    final res = await http.get(
      Uri.parse('$_base/student/profile/$id/portfolioLinks'),
      headers: await _headers(),
    );
    if (res.statusCode != 200) return [];
    final body = jsonDecode(res.body);
    final list = body is List
        ? body
        : (body['portfolioLinks'] ?? body['data'] ?? []) as List;
    return list
        .map((e) => PortfolioLinkModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<bool> deletePortfolioLink(int index) async {
    final id = await _studentId;
    if (id == null) return false;
    final res = await http.delete(
      Uri.parse('$_base/student/profile/$id/portfolioLinks/$index'),
      headers: await _headers(),
    );
    return res.statusCode == 200 || res.statusCode == 201;
  }
}
