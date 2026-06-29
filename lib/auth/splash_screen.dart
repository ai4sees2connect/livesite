import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:internship_app/auth/choose_role_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 3), () {
      if (!mounted) return;
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const ChooseRoleScreen()),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFFEEF2FF), Colors.white],
              ),
            ),
          ),
          Positioned(
            top: -70,
            right: -70,
            child: Container(
              width: 220,
              height: 220,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFF3B82F6).withValues(alpha: 0.08),
              ),
            ),
          ),
          const Positioned(top: 52, left: 16, child: _DotGrid()),
          Positioned(
            top: size.height * 0.38,
            right: 20,
            child: const _PlusSign(color: Color(0xFF3B82F6)),
          ),
          Positioned(
            top: size.height * 0.58,
            left: 14,
            child: const _PlusSign(color: Color(0xFFADB5FF)),
          ),
          SafeArea(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(24, 22, 24, 0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 60),
                      RichText(
                        text: const TextSpan(
                          style: TextStyle(
                            fontSize: 36,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF111827),
                            height: 1.2,
                          ),
                          children: [
                            TextSpan(text: 'Find Internships\nthat actually\n'),
                            TextSpan(
                              text: 'match you.',
                              style: TextStyle(color: Color(0xFF3B82F6)),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                Expanded(
                  child: Center(
                    child: Transform.scale(
                      scale: 1.019,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(24),
                        child: Image.asset('assets/splash.png', fit: BoxFit.contain),
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(24, 12, 24, 20),
                  child: Center(
                    child: Image.network(
                      'https://livesite-two.vercel.app/logos/INTERNSNEST%20LOGO.png',
                      width: 262,
                      height: 89,
                      fit: BoxFit.contain,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _DotGrid extends StatelessWidget {
  const _DotGrid();

  @override
  Widget build(BuildContext context) {
    const rows = 5;
    const cols = 5;
    return Column(
      children: List.generate(
        rows,
        (r) => Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: Row(
            children: List.generate(
              cols,
              (c) => Container(
                margin: const EdgeInsets.only(right: 8),
                width: 4,
                height: 4,
                decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFFBFC8FF)),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _PlusSign extends StatelessWidget {
  final Color color;
  const _PlusSign({required this.color});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 16,
      height: 16,
      child: CustomPaint(painter: _PlusPainter(color: color)),
    );
  }
}

class _PlusPainter extends CustomPainter {
  final Color color;
  const _PlusPainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 2
      ..strokeCap = StrokeCap.round;
    canvas.drawLine(Offset(size.width / 2, 0), Offset(size.width / 2, size.height), paint);
    canvas.drawLine(Offset(0, size.height / 2), Offset(size.width, size.height / 2), paint);
  }

  @override
  bool shouldRepaint(_) => false;
}

// ignore: unused_element
class _ConnectorPainter extends CustomPainter {
  final double screenWidth;
  const _ConnectorPainter({required this.screenWidth});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFBFC8FF)
      ..strokeWidth = 1.2
      ..style = PaintingStyle.stroke;

    void drawDashed(Offset from, Offset to) {
      final dx = to.dx - from.dx;
      final dy = to.dy - from.dy;
      final dist = math.sqrt(dx * dx + dy * dy);
      final steps = (dist / 8).floor();
      for (int i = 0; i < steps; i += 2) {
        final t1 = i / steps;
        final t2 = (i + 1) / steps;
        canvas.drawLine(
          Offset(from.dx + dx * t1, from.dy + dy * t1),
          Offset(from.dx + dx * t2, from.dy + dy * t2),
          paint,
        );
      }
    }

    final briefcase = Offset(screenWidth * 0.42 + 26, 26);
    final search = Offset(30, size.height * 0.12 + 26);
    final document = Offset(size.width - 30, size.height * 0.12 + 26);
    drawDashed(briefcase, search);
    drawDashed(briefcase, document);
    drawDashed(search, document);
  }

  @override
  bool shouldRepaint(_) => false;
}
