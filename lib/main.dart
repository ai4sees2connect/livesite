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
  runApp(const MyApp());
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
