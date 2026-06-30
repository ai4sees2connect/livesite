import 'package:flutter/material.dart';
import 'package:internship_app/auth/choose_role_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  static const _primary = Color(0xFF3B82F6);
  static const _bg = Color(0xFFF8FAFC);

  // ── mock data ────────────────────────────────────────────────────────────────
  final String _name = 'Student Demo';
  final String _email = 'student@gmail.com';
  final String _location = 'India, Karnataka, Bangalore Urban';
  final String _experience = 'No Experience';
  final String _gender = 'Male';

  String? _resumeName = 'CAG_RAG.pdf';
  String? _resumeDate = '18th June, 2026';

  final List<Map<String, String>> _education = [
    {
      'degree': 'M.Tech',
      'field': 'Computers',
      'institute': 'NMSS',
      'year': '2017 - 2019',
      'score': '9.5 CGPA',
    },
  ];

  final List<Map<String, String>> _workExp = [
    {
      'role': 'Role 1',
      'company': 'Company 1',
      'type': 'Job',
      'duration': '18-06-2014 - 18-02-2015',
      'desc': 'Description 1',
    },
  ];

  final List<Map<String, String>> _skills = [
    {'name': 'React.js', 'level': 'Intermediate'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  // ── Profile header card ────────────────────────────────────
                  _card(
                    child: Column(
                      children: [
                        // Avatar
                        Stack(
                          alignment: Alignment.center,
                          children: [
                            Container(
                              width: 90,
                              height: 90,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: Colors.grey.shade300,
                                  width: 2,
                                  style: BorderStyle.solid,
                                ),
                              ),
                              child: const CircleAvatar(
                                backgroundColor: Color(0xFFEFF2F7),
                                child: Icon(Icons.camera_alt_outlined,
                                    color: Colors.grey, size: 32),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text(_name,
                            style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF1E293B))),
                        const SizedBox(height: 4),
                        Text(_email,
                            style: TextStyle(
                                fontSize: 13, color: Colors.grey.shade500)),
                        const SizedBox(height: 16),
                        Divider(color: Colors.grey.shade100),
                        const SizedBox(height: 8),
                        _profileRow(_location, onEdit: () {}),
                        _profileRow(_experience, onEdit: () {}),
                        _profileRow(_gender, onEdit: () {}),
                      ],
                    ),
                  ),

                  const SizedBox(height: 14),

                  // ── Resume card ────────────────────────────────────────────
                  _card(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        const Text('Resume',
                            style: TextStyle(
                                fontSize: 17,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF1E293B))),
                        const SizedBox(height: 8),
                        Text(
                          'Your resume is the first impression you make on potential employers. '
                          'Craft it carefully to secure your desired job or internship.',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                              fontSize: 13, color: Colors.grey.shade600, height: 1.5),
                        ),
                        if (_resumeName != null) ...[
                          const SizedBox(height: 10),
                          Text(_resumeName!,
                              style: const TextStyle(
                                  color: _primary,
                                  fontWeight: FontWeight.w600,
                                  fontSize: 14)),
                          const SizedBox(height: 10),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(_resumeDate ?? '',
                                  style: TextStyle(
                                      fontSize: 13, color: Colors.grey.shade600)),
                              Row(
                                children: [
                                  IconButton(
                                    icon: const Icon(Icons.download_rounded,
                                        color: _primary, size: 22),
                                    onPressed: () {},
                                    padding: EdgeInsets.zero,
                                    constraints: const BoxConstraints(),
                                  ),
                                  const SizedBox(width: 12),
                                  IconButton(
                                    icon: const Icon(Icons.delete_rounded,
                                        color: Color(0xFFEF4444), size: 22),
                                    onPressed: () =>
                                        setState(() { _resumeName = null; _resumeDate = null; }),
                                    padding: EdgeInsets.zero,
                                    constraints: const BoxConstraints(),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ],
                        const SizedBox(height: 12),
                        OutlinedButton(
                          onPressed: () {},
                          style: OutlinedButton.styleFrom(
                            foregroundColor: _primary,
                            side: const BorderSide(color: _primary),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(20)),
                            padding: const EdgeInsets.symmetric(
                                horizontal: 24, vertical: 10),
                          ),
                          child: const Text('Update Resume',
                              style: TextStyle(fontWeight: FontWeight.w600)),
                        ),
                        const SizedBox(height: 6),
                        Text('Supported formats: PDF',
                            style: TextStyle(
                                fontSize: 12, color: Colors.grey.shade500)),
                      ],
                    ),
                  ),

                  const SizedBox(height: 14),

                  // ── Education ──────────────────────────────────────────────
                  _sectionCard(
                    icon: Icons.school_rounded,
                    title: 'Education',
                    required: true,
                    onAdd: () => _showAddEducationSheet(),
                    emptyMsg: 'No education added yet.',
                    items: _education.map((e) => _educationCard(e)).toList(),
                  ),

                  const SizedBox(height: 14),

                  // ── Work Experience ────────────────────────────────────────
                  _sectionCard(
                    icon: Icons.work_rounded,
                    title: 'Work Experience',
                    optional: true,
                    onAdd: () {},
                    emptyMsg: 'No work experience added yet.',
                    items: _workExp.map((e) => _workCard(e)).toList(),
                  ),

                  const SizedBox(height: 14),

                  // ── Certificates ───────────────────────────────────────────
                  _sectionCard(
                    icon: Icons.verified_rounded,
                    title: 'Certificates',
                    optional: true,
                    onAdd: () {},
                    emptyMsg: 'No certificates added yet.',
                    items: [],
                  ),

                  const SizedBox(height: 14),

                  // ── Personal Projects ──────────────────────────────────────
                  _sectionCard(
                    icon: Icons.laptop_mac_rounded,
                    title: 'Personal Projects',
                    optional: true,
                    onAdd: () {},
                    emptyMsg: 'No personal projects added yet.',
                    items: [],
                  ),

                  const SizedBox(height: 14),

                  // ── Skills ─────────────────────────────────────────────────
                  _sectionCard(
                    icon: Icons.handyman_rounded,
                    title: 'Skills',
                    required: true,
                    onAdd: () => _showAddSkillSheet(),
                    emptyMsg: 'No skills added yet.',
                    items: _skills.map((s) => _skillCard(s)).toList(),
                  ),

                  const SizedBox(height: 14),

                  // ── Portfolio ──────────────────────────────────────────────
                  _sectionCard(
                    icon: Icons.link_rounded,
                    title: 'Portfolio',
                    optional: true,
                    onAdd: () {},
                    emptyMsg: 'No portfolio links added yet.',
                    items: [],
                  ),

                  const SizedBox(height: 14),

                  // ── Logout ─────────────────────────────────────────────────
                  _card(
                    child: ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: CircleAvatar(
                        radius: 20,
                        backgroundColor:
                            const Color(0xFFEF4444).withValues(alpha: 0.1),
                        child: const Icon(Icons.logout,
                            color: Color(0xFFEF4444), size: 20),
                      ),
                      title: const Text('Logout',
                          style: TextStyle(
                              color: Color(0xFFEF4444),
                              fontWeight: FontWeight.w600)),
                      trailing: const Icon(Icons.chevron_right,
                          color: Color(0xFFEF4444)),
                      onTap: () => Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(
                            builder: (_) => const ChooseRoleScreen()),
                        (_) => false,
                      ),
                    ),
                  ),
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Section card ─────────────────────────────────────────────────────────────
  Widget _sectionCard({
    required IconData icon,
    required String title,
    required String emptyMsg,
    required VoidCallback onAdd,
    required List<Widget> items,
    bool required = false,
    bool optional = false,
  }) {
    return _card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: _primary, size: 20),
              const SizedBox(width: 8),
              Text(title,
                  style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1E293B))),
              if (required)
                const Text(' *',
                    style: TextStyle(color: Colors.red, fontSize: 15)),
              if (optional)
                Text(' (Optional)',
                    style: TextStyle(
                        fontSize: 12, color: Colors.grey.shade500)),
              const Spacer(),
              GestureDetector(
                onTap: onAdd,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: _primary.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.add, color: _primary, size: 16),
                      SizedBox(width: 2),
                      Text('Add',
                          style: TextStyle(
                              color: _primary,
                              fontSize: 13,
                              fontWeight: FontWeight.w600)),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          if (items.isEmpty)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 18),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(emptyMsg,
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey.shade500, fontSize: 13)),
            )
          else
            ...items.map((w) => Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: w,
                )),
        ],
      ),
    );
  }

  // ── Education card ────────────────────────────────────────────────────────────
  Widget _educationCard(Map<String, String> e) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(e['degree'] ?? '',
                    style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                        color: Color(0xFF1E293B))),
                const SizedBox(height: 2),
                Text(e['field'] ?? '',
                    style: TextStyle(fontSize: 13, color: Colors.grey.shade600)),
                Text(e['institute'] ?? '',
                    style: TextStyle(fontSize: 13, color: Colors.grey.shade600)),
                Text(e['year'] ?? '',
                    style: TextStyle(fontSize: 12, color: Colors.grey.shade500)),
                const SizedBox(height: 4),
                Text('Score: ${e['score'] ?? ''}',
                    style: const TextStyle(
                        color: _primary,
                        fontWeight: FontWeight.w600,
                        fontSize: 13)),
              ],
            ),
          ),
          _editDeleteRow(
            onEdit: () {},
            onDelete: () => setState(
                () => _education.remove(e)),
          ),
        ],
      ),
    );
  }

  // ── Work card ─────────────────────────────────────────────────────────────────
  Widget _workCard(Map<String, String> e) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('${e['role']} at ${e['company']}',
                    style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                        color: Color(0xFF1E293B))),
                const SizedBox(height: 2),
                Text(e['type'] ?? '',
                    style: const TextStyle(color: _primary, fontSize: 13)),
                Text('Duration: ${e['duration']}',
                    style: TextStyle(fontSize: 12, color: Colors.grey.shade500)),
                const SizedBox(height: 2),
                Text(e['desc'] ?? '',
                    style: TextStyle(fontSize: 13, color: Colors.grey.shade600)),
              ],
            ),
          ),
          _editDeleteRow(
            onEdit: () {},
            onDelete: () => setState(() => _workExp.remove(e)),
          ),
        ],
      ),
    );
  }

  // ── Skill card ────────────────────────────────────────────────────────────────
  Widget _skillCard(Map<String, String> s) {
    const levelColors = {
      'Beginner': Color(0xFF10B981),
      'Intermediate': Color(0xFFF59E0B),
      'Advanced': Color(0xFFEF4444),
    };
    final color = levelColors[s['level']] ?? _primary;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(s['name'] ?? '',
                    style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                        color: Color(0xFF1E293B))),
                const SizedBox(height: 6),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(s['level'] ?? '',
                      style: TextStyle(
                          color: color,
                          fontSize: 12,
                          fontWeight: FontWeight.w600)),
                ),
              ],
            ),
          ),
          _editDeleteRow(
            onEdit: () {},
            onDelete: () => setState(() => _skills.remove(s)),
          ),
        ],
      ),
    );
  }

  // ── Shared helpers ────────────────────────────────────────────────────────────
  Widget _card({required Widget child}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 8,
              offset: const Offset(0, 2)),
        ],
      ),
      child: child,
    );
  }

  Widget _profileRow(String value, {required VoidCallback onEdit}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(value,
              style: TextStyle(fontSize: 13, color: Colors.grey.shade700)),
          const SizedBox(width: 6),
          GestureDetector(
            onTap: onEdit,
            child: const Icon(Icons.edit, size: 14, color: Colors.grey),
          ),
        ],
      ),
    );
  }

  Widget _editDeleteRow(
      {required VoidCallback onEdit, required VoidCallback onDelete}) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        IconButton(
          icon: const Icon(Icons.edit, color: _primary, size: 18),
          onPressed: onEdit,
          padding: EdgeInsets.zero,
          constraints: const BoxConstraints(),
        ),
        const SizedBox(width: 8),
        IconButton(
          icon: const Icon(Icons.delete_rounded,
              color: Color(0xFFEF4444), size: 18),
          onPressed: onDelete,
          padding: EdgeInsets.zero,
          constraints: const BoxConstraints(),
        ),
      ],
    );
  }

  // ── Sheets ────────────────────────────────────────────────────────────────────
  void _showAddEducationSheet() {
    final degreeCtrl = TextEditingController();
    final fieldCtrl = TextEditingController();
    final instituteCtrl = TextEditingController();
    final yearCtrl = TextEditingController();
    final scoreCtrl = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => Padding(
        padding: EdgeInsets.fromLTRB(
            20, 20, 20, MediaQuery.viewInsetsOf(context).bottom + 20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Add Education',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _sheetField(degreeCtrl, 'Degree (e.g. B.Tech)'),
            _sheetField(fieldCtrl, 'Field of Study'),
            _sheetField(instituteCtrl, 'Institute Name'),
            _sheetField(yearCtrl, 'Year (e.g. 2020 - 2024)'),
            _sheetField(scoreCtrl, 'Score (e.g. 8.5 CGPA)'),
            const SizedBox(height: 8),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                    backgroundColor: _primary,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12))),
                onPressed: () {
                  if (degreeCtrl.text.isNotEmpty) {
                    setState(() {
                      _education.add({
                        'degree': degreeCtrl.text.trim(),
                        'field': fieldCtrl.text.trim(),
                        'institute': instituteCtrl.text.trim(),
                        'year': yearCtrl.text.trim(),
                        'score': scoreCtrl.text.trim(),
                      });
                    });
                    Navigator.pop(context);
                  }
                },
                child: const Text('Add',
                    style: TextStyle(
                        color: Colors.white, fontWeight: FontWeight.w700)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showAddSkillSheet() {
    final nameCtrl = TextEditingController();
    String level = 'Beginner';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => StatefulBuilder(
        builder: (_, setSheetState) => Padding(
          padding: EdgeInsets.fromLTRB(
              20, 20, 20, MediaQuery.viewInsetsOf(context).bottom + 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Add Skill',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              _sheetField(nameCtrl, 'Skill Name (e.g. React.js)'),
              const SizedBox(height: 8),
              const Text('Level',
                  style: TextStyle(fontSize: 13, color: Colors.grey)),
              const SizedBox(height: 8),
              Row(
                children: ['Beginner', 'Intermediate', 'Advanced'].map((l) {
                  final selected = level == l;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: GestureDetector(
                      onTap: () => setSheetState(() => level = l),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: selected
                              ? _primary
                              : _primary.withValues(alpha: 0.08),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(l,
                            style: TextStyle(
                                color:
                                    selected ? Colors.white : _primary,
                                fontSize: 13,
                                fontWeight: FontWeight.w600)),
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                      backgroundColor: _primary,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12))),
                  onPressed: () {
                    if (nameCtrl.text.isNotEmpty) {
                      setState(() {
                        _skills.add(
                            {'name': nameCtrl.text.trim(), 'level': level});
                      });
                      Navigator.pop(context);
                    }
                  },
                  child: const Text('Add',
                      style: TextStyle(
                          color: Colors.white, fontWeight: FontWeight.w700)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _sheetField(TextEditingController ctrl, String hint) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: TextField(
        controller: ctrl,
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: const TextStyle(color: Colors.grey, fontSize: 13),
          filled: true,
          fillColor: const Color(0xFFF1F5F9),
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: BorderSide.none),
        ),
      ),
    );
  }

  void _showMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(height: 12),
          ListTile(
            leading: const Icon(Icons.notifications_outlined, color: _primary),
            title: const Text('Notifications'),
            onTap: () => Navigator.pop(context),
          ),
          ListTile(
            leading: const Icon(Icons.help_outline, color: _primary),
            title: const Text('Help & Support'),
            onTap: () => Navigator.pop(context),
          ),
          ListTile(
            leading: const Icon(Icons.info_outline, color: _primary),
            title: const Text('About'),
            onTap: () => Navigator.pop(context),
          ),
          const SizedBox(height: 8),
        ],
      ),
    );
  }
}
