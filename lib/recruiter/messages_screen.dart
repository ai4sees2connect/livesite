import 'package:flutter/material.dart';

class RecruiterMessagesScreen extends StatelessWidget {
  const RecruiterMessagesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const primary = Color(0xFF5B5CEB);

    final chats = [
      {'name': 'Arjun Sharma', 'role': 'Flutter Developer Intern', 'last': 'Thank you for the opportunity!', 'time': '10:45 AM', 'unread': '3', 'initials': 'AS', 'avatarBg': 0xFFEEF2FF},
      {'name': 'Priya Patel', 'role': 'UI/UX Design Intern', 'last': 'I have sent my portfolio link.', 'time': 'Yesterday', 'unread': '0', 'initials': 'PP', 'avatarBg': 0xFFFCE7F3},
      {'name': 'Rahul Singh', 'role': 'ML Intern', 'last': 'When is the interview scheduled?', 'time': 'Mon', 'unread': '1', 'initials': 'RS', 'avatarBg': 0xFFECFDF5},
      {'name': 'Neha Gupta', 'role': 'Backend Developer Intern', 'last': 'I am available for the task.', 'time': 'Sun', 'unread': '0', 'initials': 'NG', 'avatarBg': 0xFFFFF7ED},
      {'name': 'Kiran Mehta', 'role': 'Data Analyst Intern', 'last': 'Submitted the assignment.', 'time': 'Sat', 'unread': '0', 'initials': 'KM', 'avatarBg': 0xFFF0FDF4},
    ];

    final avatarTextColors = [
      primary, const Color(0xFFEC4899), const Color(0xFF10B981),
      const Color(0xFFF59E0B), const Color(0xFF06B6D4),
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: Column(
        children: [
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF4338CA), Color(0xFF5B5CEB)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.vertical(bottom: Radius.circular(24)),
            ),
            child: SafeArea(
              bottom: false,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('${chats.length} Conversations',
                        style: TextStyle(color: Colors.white.withValues(alpha: 0.8), fontSize: 13)),
                    const SizedBox(height: 2),
                    const Text('Messages',
                        style: TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 14),
                    Container(
                      height: 46,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: TextField(
                        style: const TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          hintText: 'Search candidates...',
                          hintStyle: TextStyle(color: Colors.white.withValues(alpha: 0.6), fontSize: 14),
                          prefixIcon: Icon(Icons.search_rounded, color: Colors.white.withValues(alpha: 0.7)),
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(vertical: 13),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.fromLTRB(16, 4, 16, 100),
              itemCount: chats.length,
              itemBuilder: (context, index) {
                final chat = chats[index];
                final hasUnread = chat['unread'] != '0';
                final avatarColor = Color(chat['avatarBg'] as int);
                final textColor = avatarTextColors[index % avatarTextColors.length];

                return Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 8, offset: const Offset(0, 2)),
                    ],
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    leading: Stack(
                      children: [
                        CircleAvatar(
                          radius: 26,
                          backgroundColor: avatarColor,
                          child: Text(chat['initials'] as String,
                              style: TextStyle(color: textColor, fontWeight: FontWeight.bold, fontSize: 14)),
                        ),
                        if (hasUnread)
                          Positioned(
                            right: 0,
                            bottom: 0,
                            child: Container(
                              width: 12,
                              height: 12,
                              decoration: BoxDecoration(
                                color: const Color(0xFF10B981),
                                shape: BoxShape.circle,
                                border: Border.all(color: Colors.white, width: 2),
                              ),
                            ),
                          ),
                      ],
                    ),
                    title: Text(chat['name'] as String,
                        style: TextStyle(
                            fontWeight: hasUnread ? FontWeight.w800 : FontWeight.w600,
                            color: const Color(0xFF1E293B),
                            fontSize: 14)),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 1),
                        Text(chat['role'] as String,
                            style: const TextStyle(fontSize: 11, color: primary, fontWeight: FontWeight.w500)),
                        const SizedBox(height: 2),
                        Text(chat['last'] as String,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                                color: hasUnread ? const Color(0xFF374151) : Colors.grey.shade400,
                                fontSize: 12,
                                fontWeight: hasUnread ? FontWeight.w500 : FontWeight.normal)),
                      ],
                    ),
                    trailing: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(chat['time'] as String,
                            style: TextStyle(
                                fontSize: 11,
                                color: hasUnread ? primary : Colors.grey.shade400,
                                fontWeight: hasUnread ? FontWeight.w600 : FontWeight.normal)),
                        const SizedBox(height: 5),
                        if (hasUnread)
                          Container(
                            width: 20,
                            height: 20,
                            decoration: const BoxDecoration(color: primary, shape: BoxShape.circle),
                            child: Center(
                              child: Text(chat['unread'] as String,
                                  style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                            ),
                          )
                        else
                          const SizedBox(height: 20),
                      ],
                    ),
                    onTap: () {},
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
