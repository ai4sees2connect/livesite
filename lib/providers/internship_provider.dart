import 'package:flutter/material.dart';
import 'package:internship_app/models/internship_model.dart';
import 'package:internship_app/services/internship_service.dart';

enum InternshipLoadState { idle, loading, loaded, error }

class InternshipProvider extends ChangeNotifier {
  final InternshipService _service = InternshipService();

  List<InternshipModel> _all = [];
  InternshipLoadState state = InternshipLoadState.idle;
  String? errorMessage;

  InternshipProvider() {
    loadInternships();
  }

  String _selectedPay = 'All';
  String _selectedWorkType = 'All';
  RangeValues _stipendRange = const RangeValues(0, 50000);

  String get selectedPay => _selectedPay;
  String get selectedWorkType => _selectedWorkType;
  RangeValues get stipendRange => _stipendRange;

  List<InternshipModel> get all => _all;

  Future<void> loadInternships() async {
    state = InternshipLoadState.loading;
    errorMessage = null;
    notifyListeners();
    try {
      _all = await _service.getAllInternships();
      state = InternshipLoadState.loaded;
    } catch (e) {
      errorMessage = e.toString();
      state = InternshipLoadState.error;
    }
    notifyListeners();
  }

  List<InternshipModel> get filtered {
    return _all.where((item) {
      if (_selectedPay == 'Paid' && !item.paid) { return false; }
      if (_selectedPay == 'Unpaid' && item.paid) { return false; }
      if (_selectedWorkType != 'All' && item.workType != _selectedWorkType) { return false; }
      if (item.stipendValue < _stipendRange.start || item.stipendValue > _stipendRange.end) { return false; }
      return true;
    }).toList();
  }

  bool get hasActiveFilters =>
      _selectedPay != 'All' ||
      _selectedWorkType != 'All' ||
      _stipendRange != const RangeValues(0, 50000);

  void setPayFilter(String value) {
    _selectedPay = value;
    notifyListeners();
  }

  void setWorkTypeFilter(String value) {
    _selectedWorkType = value;
    notifyListeners();
  }

  void setStipendRange(RangeValues value) {
    _stipendRange = value;
    notifyListeners();
  }

  void applyFilters({
    required String pay,
    required String workType,
    required RangeValues stipend,
  }) {
    _selectedPay = pay;
    _selectedWorkType = workType;
    _stipendRange = stipend;
    notifyListeners();
  }

  void resetFilters() {
    _selectedPay = 'All';
    _selectedWorkType = 'All';
    _stipendRange = const RangeValues(0, 50000);
    notifyListeners();
  }
}
