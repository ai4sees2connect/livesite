import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class AuthStorage {
  static const _tokenKey = 'auth_token';
  static const _studentIdKey = 'student_id';
  static const _nameKey = 'student_name';
  static const _emailKey = 'student_email';
  static const _locationKey = 'student_location';
  static const _genderKey = 'student_gender';
  static const _experienceKey = 'student_experience';

  /// Saves the JWT and decodes all available fields from it.
  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);

    final payload = _decodePayload(token);
    if (payload == null) return;

    final id = (payload['id'] ?? payload['_id'] ?? payload['sub'])?.toString();
    if (id != null) await prefs.setString(_studentIdKey, id);

    final name = (payload['name'] ?? payload['firstname'])?.toString();
    if (name != null) await prefs.setString(_nameKey, name);

    final email = payload['email']?.toString();
    if (email != null) await prefs.setString(_emailKey, email);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  static Future<String?> getStudentId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_studentIdKey);
  }

  static Future<String?> getName() async =>
      (await SharedPreferences.getInstance()).getString(_nameKey);

  static Future<String?> getEmail() async =>
      (await SharedPreferences.getInstance()).getString(_emailKey);

  static Future<String?> getLocation() async =>
      (await SharedPreferences.getInstance()).getString(_locationKey);

  static Future<String?> getGender() async =>
      (await SharedPreferences.getInstance()).getString(_genderKey);

  static Future<String?> getExperience() async =>
      (await SharedPreferences.getInstance()).getString(_experienceKey);

  static Future<void> saveStudentId(String id) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_studentIdKey, id);
  }

  /// Parses the `student` object returned by save-location / save-exp /
  /// save-gender and persists every field we care about.
  static Future<void> saveStudentFromResponse(
      Map<String, dynamic> student) async {
    final prefs = await SharedPreferences.getInstance();

    final id = (student['_id'] ?? student['id'])?.toString();
    if (id != null) await prefs.setString(_studentIdKey, id);

    final first = student['firstname']?.toString() ?? '';
    final last = student['lastname']?.toString() ?? '';
    final fullName = '$first $last'.trim();
    if (fullName.isNotEmpty) await prefs.setString(_nameKey, fullName);

    final email = student['email']?.toString();
    if (email != null) await prefs.setString(_emailKey, email);

    final loc = student['location']?.toString();
    if (loc != null && loc.isNotEmpty) {
      await prefs.setString(_locationKey, loc);
    }

    final gender = student['gender']?.toString();
    if (gender != null && gender.isNotEmpty) {
      await prefs.setString(_genderKey, gender);
    }

    final exp = (student['yearsOfExp'] ?? student['experience'])?.toString();
    if (exp != null && exp.isNotEmpty) {
      await prefs.setString(_experienceKey, exp);
    }
  }

  static Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_studentIdKey);
    await prefs.remove(_nameKey);
    await prefs.remove(_emailKey);
    await prefs.remove(_locationKey);
    await prefs.remove(_genderKey);
    await prefs.remove(_experienceKey);
  }

  /// Decodes the JWT payload (middle part) and returns the map.
  static Map<String, dynamic>? _decodePayload(String token) {
    try {
      final parts = token.split('.');
      if (parts.length != 3) return null;
      String payload = parts[1];
      payload += '=' * ((4 - payload.length % 4) % 4);
      return jsonDecode(utf8.decode(base64Url.decode(payload)))
          as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }
}
