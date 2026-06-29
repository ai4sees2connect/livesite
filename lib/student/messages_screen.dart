import 'package:flutter/material.dart';

class MessagesScreen extends StatelessWidget {
  const MessagesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const primary = Color(0xFF3B82F6);

    final chats = [
      {
        'name': 'TechCorp HR',
        'last': 'We reviewed your application and would like to...',
        'time': '10:30 AM',
        'unread': '2',
        'initials': 'TC',
        'color': 0xFF3B82F6,
        'online': true,
      },
      {
        'name': 'DesignHub Team',
        'last': 'Please share your portfolio link.',
        'time': 'Yesterday',
        'unread': '0',
        'initials': 'DH',
        'color': 0xFFEC4899,
        'online': false,
      },
      {
        'name': 'AI Labs Recruiter',
        'last': 'Interview scheduled for Monday at 11 AM.',
        'time': 'Mon',
        'unread': '1',
        'initials': 'AL',
        'color': 0xFF8B5CF6,
        'online': true,
      },
      {
        'name': 'DataSoft',
        'last': 'Thank you for applying!',
        'time': 'Sun',
        'unread': '0',
        'initials': 'DS',
        'color': 0xFF10B981,
        'online': false,
      },
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: Column(
        children: [
          Container(
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(bottom: Radius.circular(24)),
              boxShadow: [
                BoxShadow(color: Color(0x0A000000), blurRadius: 8, offset: Offset(0, 2)),
              ],
            ),
            child: SafeArea(
              bottom: false,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Messages',
                            style: TextStyle(
                                fontSize: 26, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(Icons.edit_outlined, color: Colors.grey.shade600, size: 20),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    Container(
                      height: 48,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Row(
                        children: [
                          const SizedBox(width: 14),
                          Icon(Icons.search_rounded, color: Colors.grey.shade400, size: 20),
                          const SizedBox(width: 8),
                          const Expanded(
                            child: TextField(
                              decoration: InputDecoration(
                                hintText: 'Search messages...',
                                hintStyle: TextStyle(color: Colors.grey, fontSize: 13),
                                border: InputBorder.none,
                                isDense: true,
                                contentPadding: EdgeInsets.zero,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: chats.length,
              itemBuilder: (context, index) {
                final chat = chats[index];
                final hasUnread = chat['unread'] != '0';
                final color = Color(chat['color'] as int);
                final isOnline = chat['online'] as bool;

                return Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.04),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    leading: Stack(
                      children: [
                        CircleAvatar(
                          radius: 26,
                          backgroundColor: color.withValues(alpha: 0.15),
                          child: Text(chat['initials'] as String,
                              style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 14)),
                        ),
                        if (isOnline)
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
                    title: Row(
                      children: [
                        Expanded(
                          child: Text(
                            chat['name'] as String,
                            style: TextStyle(
                              fontWeight: hasUnread ? FontWeight.w800 : FontWeight.w600,
                              color: const Color(0xFF1E293B),
                              fontSize: 15,
                            ),
                          ),
                        ),
                        Text(
                          chat['time'] as String,
                          style: TextStyle(
                            fontSize: 11,
                            color: hasUnread ? primary : Colors.grey.shade400,
                            fontWeight: hasUnread ? FontWeight.w600 : FontWeight.normal,
                          ),
                        ),
                      ],
                    ),
                    subtitle: Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Row(
                        children: [
                          Expanded(
                            child: Text(
                              chat['last'] as String,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                color: hasUnread ? const Color(0xFF475569) : Colors.grey.shade400,
                                fontSize: 13,
                                fontWeight: hasUnread ? FontWeight.w500 : FontWeight.normal,
                              ),
                            ),
                          ),
                          if (hasUnread) ...[
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                              decoration: BoxDecoration(
                                color: primary,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                chat['unread'] as String,
                                style: const TextStyle(
                                    color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700),
                              ),
                            ),
                          ],
                        ],
                      ),
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
