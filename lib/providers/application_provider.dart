import 'package:flutter/material.dart';
import 'package:internship_app/models/application_model.dart';
import 'package:internship_app/services/application_service.dart';

class ApplicationProvider extends ChangeNotifier {
  final List<ApplicationModel> _applications = ApplicationService.getMockApplications();

  List<ApplicationModel> get applications => _applications;

  int get totalCount => _applications.length;
  int get activeCount => _applications.where((a) => a.status != 'Rejected').length;
  int get rejectedCount => _applications.where((a) => a.status == 'Rejected').length;

  void addApplication(ApplicationModel application) {
    _applications.add(application);
    notifyListeners();
  }
}
