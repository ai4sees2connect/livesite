import 'package:flutter/material.dart';
import 'package:internship_app/auth/recruiter_login_screen.dart';

class RecruiterProfileScreen extends StatelessWidget {
  const RecruiterProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const primary = Color(0xFF3B82F6);

    final menuItems = [
      {'icon': Icons.business_outlined, 'label': 'Company Profile'},
      {'icon': Icons.people_outline, 'label': 'Team Members'},
      {'icon': Icons.bar_chart_outlined, 'label': 'Analytics'},
      {'icon': Icons.notifications_outlined, 'label': 'Notifications'},
      {'icon': Icons.lock_outline, 'label': 'Change Password'},
      {'icon': Icons.help_outline, 'label': 'Help & Support'},
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              // Profile header
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
                          child: const Text(
                            'TC',
                            style: TextStyle(
                              color: primary,
                              fontSize: 28,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        CircleAvatar(
                          radius: 14,
                          backgroundColor: primary,
                          child: const Icon(Icons.edit,
                              size: 14, color: Colors.white),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    const Text(
                      'TechCorp',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF1E293B),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'hr@techcorp.com',
                      style: TextStyle(
                          color: Colors.grey.shade600, fontSize: 14),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Text(
                        'Pro Plan',
                        style: TextStyle(
                          color: Color(0xFF10B981),
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _stat('6', 'Active Posts'),
                        _divider(),
                        _stat('48', 'Applicants'),
                        _divider(),
                        _stat('3', 'Hired'),
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
                          contentPadding: const EdgeInsets.symmetric(
                              horizontal: 20, vertical: 2),
                          leading: CircleAvatar(
                            radius: 20,
                            backgroundColor: primary.withValues(alpha: 0.08),
                            child: Icon(
                              item['icon'] as IconData,
                              color: primary,
                              size: 20,
                            ),
                          ),
                          title: Text(
                            item['label'] as String,
                            style: const TextStyle(
                              fontSize: 15,
                              color: Color(0xFF1E293B),
                            ),
                          ),
                          trailing: const Icon(Icons.chevron_right,
                              color: Colors.grey),
                          onTap: () {},
                        ),
                        if (item != menuItems.last)
                          Divider(
                            height: 1,
                            indent: 64,
                            color: Colors.grey.shade100,
                          ),
                      ],
                    );
                  }).toList(),
                ),
              ),

              const SizedBox(height: 12),

              Container(
                color: Colors.white,
                child: ListTile(
                  contentPadding: const EdgeInsets.symmetric(
                      horizontal: 20, vertical: 2),
                  leading: CircleAvatar(
                    radius: 20,
                    backgroundColor:
                        const Color(0xFFEF4444).withValues(alpha: 0.1),
                    child: const Icon(Icons.logout,
                        color: Color(0xFFEF4444), size: 20),
                  ),
                  title: const Text(
                    'Logout',
                    style: TextStyle(
                      fontSize: 15,
                      color: Color(0xFFEF4444),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  onTap: () {
                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(
                          builder: (_) => const RecruiterLoginScreen()),
                      (_) => false,
                    );
                  },
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
          Text(
            value,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1E293B),
            ),
          ),
          Text(
            label,
            style: TextStyle(color: Colors.grey.shade500, fontSize: 13),
          ),
        ],
      ),
    );
  }

  Widget _divider() {
    return Container(height: 30, width: 1, color: Colors.grey.shade200);
  }
}
