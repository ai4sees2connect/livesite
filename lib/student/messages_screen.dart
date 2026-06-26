import 'package:flutter/material.dart';

class MessagesScreen extends StatelessWidget {
  const MessagesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const primary = Color(0xFF3B82F6);

    final chats = [
      {
        'name': 'TechCorp HR',
        'last': 'We reviewed your application...',
        'time': '10:30 AM',
        'unread': '2',
        'initials': 'TC',
      },
      {
        'name': 'DesignHub Team',
        'last': 'Please share your portfolio link.',
        'time': 'Yesterday',
        'unread': '0',
        'initials': 'DH',
      },
      {
        'name': 'AI Labs Recruiter',
        'last': 'Interview scheduled for Monday.',
        'time': 'Mon',
        'unread': '1',
        'initials': 'AL',
      },
      {
        'name': 'DataSoft',
        'last': 'Thank you for applying!',
        'time': 'Sun',
        'unread': '0',
        'initials': 'DS',
      },
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: SafeArea(
        child: Column(
          children: [
            Container(
              color: Colors.white,
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Messages',
                    style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1E293B),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    height: 48,
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const TextField(
                      decoration: InputDecoration(
                        hintText: 'Search messages...',
                        hintStyle: TextStyle(color: Colors.grey, fontSize: 14),
                        prefixIcon: Icon(Icons.search, color: Colors.grey),
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(vertical: 14),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: ListView.separated(
                itemCount: chats.length,
                separatorBuilder: (_, _) => const Divider(height: 1, indent: 76),
                itemBuilder: (context, index) {
                  final chat = chats[index];
                  final hasUnread = chat['unread'] != '0';
                  return ListTile(
                    tileColor: Colors.white,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                    leading: CircleAvatar(
                      radius: 26,
                      backgroundColor: primary.withValues(alpha: 0.12),
                      child: Text(
                        chat['initials']!,
                        style: const TextStyle(
                          color: primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    title: Text(
                      chat['name']!,
                      style: TextStyle(
                        fontWeight: hasUnread ? FontWeight.w700 : FontWeight.w500,
                        color: const Color(0xFF1E293B),
                      ),
                    ),
                    subtitle: Text(
                      chat['last']!,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        color: hasUnread ? const Color(0xFF1E293B) : Colors.grey,
                        fontSize: 13,
                      ),
                    ),
                    trailing: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          chat['time']!,
                          style: TextStyle(
                            fontSize: 12,
                            color: hasUnread ? primary : Colors.grey,
                          ),
                        ),
                        const SizedBox(height: 4),
                        if (hasUnread)
                          CircleAvatar(
                            radius: 10,
                            backgroundColor: primary,
                            child: Text(
                              chat['unread']!,
                              style: const TextStyle(color: Colors.white, fontSize: 11),
                            ),
                          ),
                      ],
                    ),
                    onTap: () {},
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
