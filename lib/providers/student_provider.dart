import 'package:flutter/material.dart';

class StudentProvider extends ChangeNotifier {
  int _savedCount = 0;

  int get savedCount => _savedCount;

  void toggleSaved() {
    _savedCount++;
    notifyListeners();
  }
}
