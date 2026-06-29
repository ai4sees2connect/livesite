import 'package:flutter/material.dart';
import 'package:internship_app/models/user_model.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _currentUser;

  UserModel? get currentUser => _currentUser;
  bool get isLoggedIn => _currentUser != null;

  void loginAsStudent({required String name, required String email}) {
    _currentUser = UserModel(
      id: '1',
      name: name,
      email: email,
      role: 'student',
      initials: name.split(' ').map((e) => e[0]).take(2).join().toUpperCase(),
    );
    notifyListeners();
  }

  void loginAsRecruiter({required String name, required String email}) {
    _currentUser = UserModel(
      id: '2',
      name: name,
      email: email,
      role: 'recruiter',
      initials: name.split(' ').map((e) => e[0]).take(2).join().toUpperCase(),
    );
    notifyListeners();
  }

  void logout() {
    _currentUser = null;
    notifyListeners();
  }
}
