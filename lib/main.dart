import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:internship_app/auth/splash_screen.dart';
import 'package:internship_app/providers/auth_provider.dart';
import 'package:internship_app/providers/internship_provider.dart';
import 'package:internship_app/providers/application_provider.dart';
import 'package:internship_app/providers/student_provider.dart';
import 'package:internship_app/providers/recruiter_provider.dart';
import 'package:internship_app/providers/student_profile_provider.dart';

void main() {
  runApp(const AppRestarter(child: MyApp()));
}

/// Wraps the entire app. Calling `AppRestarter.restart(context)` tears down
/// and recreates the full widget tree — every provider, every state — exactly
/// like a fresh app launch. Use this on logout instead of manual resets.
class AppRestarter extends StatefulWidget {
  final Widget child;
  const AppRestarter({super.key, required this.child});

  static void restart(BuildContext context) {
    context.findAncestorStateOfType<_AppRestarterState>()!._restart();
  }

  @override
  State<AppRestarter> createState() => _AppRestarterState();
}

class _AppRestarterState extends State<AppRestarter> {
  Key _key = UniqueKey();

  void _restart() => setState(() => _key = UniqueKey());

  @override
  Widget build(BuildContext context) =>
      KeyedSubtree(key: _key, child: widget.child);
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => InternshipProvider()),
        ChangeNotifierProvider(create: (_) => ApplicationProvider()),
        ChangeNotifierProvider(create: (_) => StudentProvider()),
        ChangeNotifierProvider(create: (_) => RecruiterProvider()),
        ChangeNotifierProvider(create: (_) => StudentProfileProvider()),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'InternsNest',
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF3B82F6)),
        ),
        home: const SplashScreen(),
      ),
    );
  }
}
