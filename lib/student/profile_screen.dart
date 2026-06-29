import 'package:flutter/material.dart';
import 'package:internship_app/auth/choose_role_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const primary = Color(0xFF3B82F6);

    final menuItems = [
      {'icon': Icons.person_outline, 'label': 'Edit Profile'},
      {'icon': Icons.description_outlined, 'label': 'My Resume'},
      {'icon': Icons.notifications_outlined, 'label': 'Notifications'},
      {'icon': Icons.lock_outline, 'label': 'Change Password'},
      {'icon': Icons.help_outline, 'label': 'Help & Support'},
      {'icon': Icons.info_outline, 'label': 'About'},
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              Container(
                width: double.infinity,
                color: Colors.white,
                padding: const EdgeInsets.fromLTRB(20, 24, 20, 28),
                child: Column(
                  children: [
                    Stack(
                      alignment: Alignment.bottomRight,
                      children: [
                        CircleAvatar(
                          radius: 48,
                          backgroundColor: primary.withValues(alpha: 0.12),
                          child: const Text('RB',
                              style: TextStyle(
                                  color: primary, fontSize: 28, fontWeight: FontWeight.bold)),
                        ),
                        CircleAvatar(
                          radius: 14,
                          backgroundColor: primary,
                          child: const Icon(Icons.edit, size: 14, color: Colors.white),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    const Text('Rajnikant Behera',
                        style: TextStyle(
                            fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
                    const SizedBox(height: 4),
                    Text('rajnikantb2002@gmail.com',
                        style: TextStyle(color: Colors.grey.shade600, fontSize: 14)),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _stat('4', 'Applied'),
                        _divider(),
                        _stat('2', 'Shortlisted'),
                        _divider(),
                        _stat('1', 'Offer'),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Container(
                color: Colors.white,
                child: Column(
                  children: menuItems.map((item) {
                    return Column(
                      children: [
                        ListTile(
                          contentPadding:
                              const EdgeInsets.symmetric(horizontal: 20, vertical: 2),
                          leading: CircleAvatar(
                            radius: 20,
                            backgroundColor: primary.withValues(alpha: 0.08),
                            child: Icon(item['icon'] as IconData, color: primary, size: 20),
                          ),
                          title: Text(item['label'] as String,
                              style: const TextStyle(fontSize: 15, color: Color(0xFF1E293B))),
                          trailing: const Icon(Icons.chevron_right, color: Colors.grey),
                          onTap: () {},
                        ),
                        if (item != menuItems.last)
                          Divider(height: 1, indent: 64, color: Colors.grey.shade100),
                      ],
                    );
                  }).toList(),
                ),
              ),
              const SizedBox(height: 12),
              Container(
                color: Colors.white,
                child: ListTile(
                  contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 2),
                  leading: CircleAvatar(
                    radius: 20,
                    backgroundColor: const Color(0xFFEF4444).withValues(alpha: 0.1),
                    child: const Icon(Icons.logout, color: Color(0xFFEF4444), size: 20),
                  ),
                  title: const Text('Logout',
                      style: TextStyle(
                          fontSize: 15, color: Color(0xFFEF4444), fontWeight: FontWeight.w600)),
                  onTap: () => Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (_) => const ChooseRoleScreen()),
                    (_) => false,
                  ),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _stat(String value, String label) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        children: [
          Text(value,
              style: const TextStyle(
                  fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
          Text(label, style: TextStyle(color: Colors.grey.shade500, fontSize: 13)),
        ],
      ),
    );
  }

  Widget _divider() => Container(height: 30, width: 1, color: Colors.grey.shade200);
}
