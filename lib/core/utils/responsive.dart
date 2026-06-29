import 'package:flutter/material.dart';

class Responsive {
  final BuildContext context;
  late final double _width;
  late final double _height;

  Responsive(this.context) {
    final size = MediaQuery.sizeOf(context);
    _width = size.width;
    _height = size.height;
  }

  double get width => _width;
  double get height => _height;

  /// Fraction of screen height
  double h(double fraction) => _height * fraction;

  /// Fraction of screen width
  double w(double fraction) => _width * fraction;

  /// Responsive horizontal padding (scales 16→24 from 360→430 width)
  double get hPad => (_width / 375 * 20).clamp(16.0, 28.0);

  /// Responsive font scale factor
  double get fontScale => (_width / 375).clamp(0.85, 1.15);

  bool get isSmall => _width < 380;
  bool get isMedium => _width >= 380 && _width < 430;
  bool get isLarge => _width >= 430;
}
