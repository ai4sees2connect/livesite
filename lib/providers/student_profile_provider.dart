import 'package:flutter/material.dart';
import 'package:internship_app/core/storage/auth_storage.dart';
import 'package:internship_app/models/student_profile_model.dart';
import 'package:internship_app/services/student_service.dart';

enum LoadState { idle, loading, loaded, error }

class StudentProfileProvider extends ChangeNotifier {
  final _service = StudentService();

  LoadState state = LoadState.idle;
  String? errorMessage;

  // ── Profile data ──────────────────────────────────────────────────────────────
  String name = '';
  String email = '';
  String location = '';
  String experience = '';
  String gender = '';
  String profilePictureUrl = '';

  ResumeModel? resume;
  List<EducationModel> education = [];
  List<WorkExperienceModel> workExperience = [];
  List<CertificateModel> certificates = [];
  List<ProjectModel> projects = [];
  List<SkillModel> skills = [];
  List<PortfolioLinkModel> portfolioLinks = [];

  // ── Reset ─────────────────────────────────────────────────────────────────────
  void reset() {
    name = '';
    email = '';
    location = '';
    experience = '';
    gender = '';
    profilePictureUrl = '';
    resume = null;
    education = [];
    workExperience = [];
    certificates = [];
    projects = [];
    skills = [];
    portfolioLinks = [];
    state = LoadState.idle;
    notifyListeners();
  }

  // ── Load all ──────────────────────────────────────────────────────────────────
  Future<void> loadAll() async {
    // Clear stale data from any previous session before loading new account
    name = '';
    email = '';
    location = '';
    experience = '';
    gender = '';
    profilePictureUrl = '';
    resume = null;
    education = [];
    workExperience = [];
    certificates = [];
    projects = [];
    skills = [];
    portfolioLinks = [];

    state = LoadState.loading;
    notifyListeners();
    try {
      // Load all persisted fields from SharedPreferences
      final storedName = await AuthStorage.getName();
      final storedEmail = await AuthStorage.getEmail();
      final storedLocation = await AuthStorage.getLocation();
      final storedGender = await AuthStorage.getGender();
      final storedExperience = await AuthStorage.getExperience();

      if (storedName != null && storedName.isNotEmpty) name = storedName;
      if (storedEmail != null && storedEmail.isNotEmpty) email = storedEmail;
      if (storedLocation != null && storedLocation.isNotEmpty) location = storedLocation;
      if (storedGender != null && storedGender.isNotEmpty) gender = storedGender;
      if (storedExperience != null && storedExperience.isNotEmpty) experience = storedExperience;

      // If name/email still empty, try to fetch from education endpoint which returns student info
      if (name.isEmpty) {
        await _service.fetchAndPersistStudentProfile();
        final n = await AuthStorage.getName();
        final e = await AuthStorage.getEmail();
        if (n != null && n.isNotEmpty) name = n;
        if (e != null && e.isNotEmpty) email = e;
      }

      final results = await Future.wait([
        _service.getEducation(),
        _service.getWorkExperience(),
        _service.getCertificates(),
        _service.getProjects(),
        _service.getSkills(),
        _service.getPortfolioLinks(),
        _service.getResume(),
        _service.getProfilePictureUrl(),
      ]);
      education = results[0] as List<EducationModel>;
      workExperience = results[1] as List<WorkExperienceModel>;
      certificates = results[2] as List<CertificateModel>;
      projects = results[3] as List<ProjectModel>;
      skills = results[4] as List<SkillModel>;
      portfolioLinks = results[5] as List<PortfolioLinkModel>;
      resume = results[6] as ResumeModel?;
      profilePictureUrl = results[7] as String;
      state = LoadState.loaded;
    } catch (e) {
      state = LoadState.error;
      errorMessage = e.toString();
    }
    notifyListeners();
  }

  // ── Education ─────────────────────────────────────────────────────────────────
  Future<void> deleteEducation(int index) async {
    final ok = await _service.deleteEducation(index);
    if (ok) {
      education.removeAt(index);
      notifyListeners();
    }
  }

  // ── Work Experience ───────────────────────────────────────────────────────────
  Future<void> deleteWorkExperience(int index) async {
    final ok = await _service.deleteWorkExperience(index);
    if (ok) {
      workExperience.removeAt(index);
      notifyListeners();
    }
  }

  // ── Certificates ──────────────────────────────────────────────────────────────
  Future<void> deleteCertificate(int index) async {
    final ok = await _service.deleteCertificate(index);
    if (ok) {
      certificates.removeAt(index);
      notifyListeners();
    }
  }

  // ── Projects ──────────────────────────────────────────────────────────────────
  Future<void> addProject(Map<String, dynamic> data) async {
    final ok = await _service.addProject(data);
    if (ok) await _reloadProjects();
  }

  Future<void> deleteProject(int index) async {
    final ok = await _service.deleteProject(index);
    if (ok) {
      projects.removeAt(index);
      notifyListeners();
    }
  }

  Future<void> _reloadProjects() async {
    projects = await _service.getProjects();
    notifyListeners();
  }

  // ── Skills ────────────────────────────────────────────────────────────────────
  Future<void> deleteSkill(int index) async {
    final ok = await _service.deleteSkill(index);
    if (ok) {
      skills.removeAt(index);
      notifyListeners();
    }
  }

  // ── Portfolio ─────────────────────────────────────────────────────────────────
  Future<void> deletePortfolioLink(int index) async {
    final ok = await _service.deletePortfolioLink(index);
    if (ok) {
      portfolioLinks.removeAt(index);
      notifyListeners();
    }
  }

  Future<void> addEducation(Map<String, dynamic> data) async {
    final ok = await _service.addEducation(data);
    if (ok) {
      education = await _service.getEducation();
    } else {
      // Optimistic local add if API not yet connected
      education.add(EducationModel(
        degree: data['degree'] ?? '',
        field: data['field'] ?? '',
        institute: data['institute'] ?? '',
        year: data['year'] ?? '',
        score: data['score'] ?? '',
      ));
    }
    notifyListeners();
  }

  Future<void> addSkill(Map<String, dynamic> data) async {
    final ok = await _service.addSkill(data);
    if (ok) {
      skills = await _service.getSkills();
    } else {
      skills.add(SkillModel(
          name: data['skill'] ?? data['name'] ?? '',
          level: data['level'] ?? 'Beginner'));
    }
    notifyListeners();
  }

  Future<void> addWorkExperience(Map<String, dynamic> data) async {
    final ok = await _service.addWorkExperience(data);
    if (ok) {
      workExperience = await _service.getWorkExperience();
    } else {
      workExperience.add(WorkExperienceModel(
        role: data['role'] ?? '',
        company: data['company'] ?? '',
        type: data['type'] ?? '',
        duration: data['duration'] ?? '',
        description: data['description'] ?? '',
      ));
    }
    notifyListeners();
  }

  Future<void> addCertificate(Map<String, dynamic> data) async {
    final ok = await _service.addCertificate(data);
    if (ok) {
      certificates = await _service.getCertificates();
    } else {
      certificates.add(CertificateModel(
        name: data['name'] ?? '',
        issuer: data['issuer'] ?? '',
        date: data['date'] ?? '',
      ));
    }
    notifyListeners();
  }

  Future<void> addPortfolioLink(Map<String, dynamic> data) async {
    final ok = await _service.addPortfolioLink(data);
    if (ok) {
      portfolioLinks = await _service.getPortfolioLinks();
    } else {
      portfolioLinks.add(PortfolioLinkModel(
        label: data['label'] ?? '',
        url: data['url'] ?? '',
      ));
    }
    notifyListeners();
  }

  Future<bool> uploadProfilePicture(List<int> bytes, String filename) async {
    final ok = await _service.uploadProfilePicture(bytes, filename);
    if (ok) profilePictureUrl = await _service.getProfilePictureUrl();
    notifyListeners();
    return ok;
  }

  Future<bool> uploadResume(List<int> bytes, String filename) async {
    final ok = await _service.uploadResume(bytes, filename);
    if (ok) resume = await _service.getResume();
    notifyListeners();
    return ok;
  }

  Future<bool> deleteResume() async {
    final ok = await _service.deleteResume();
    if (ok) resume = null;
    notifyListeners();
    return ok;
  }

  // ── Info fields ───────────────────────────────────────────────────────────────
  Future<void> updateLocation(String value) async {
    final ok = await _service.saveLocation(value);
    if (ok) { location = value; notifyListeners(); }
  }

  Future<void> updateExperience(String value) async {
    final ok = await _service.saveExperience(value);
    if (ok) { experience = value; notifyListeners(); }
  }

  Future<void> updateGender(String value) async {
    final ok = await _service.saveGender(value);
    if (ok) { gender = value; notifyListeners(); }
  }
}
