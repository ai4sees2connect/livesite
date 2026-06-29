import 'package:flutter/material.dart';

class RecruiterProvider extends ChangeNotifier {
  int _activePostsCount = 6;
  final int _applicantsCount = 48;

  int get activePostsCount => _activePostsCount;
  int get applicantsCount => _applicantsCount;

  void incrementPosts() {
    _activePostsCount++;
    notifyListeners();
  }
}
