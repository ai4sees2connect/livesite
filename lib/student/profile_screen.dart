import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:internship_app/auth/choose_role_screen.dart';
import 'package:internship_app/core/storage/auth_storage.dart';
import 'package:internship_app/models/student_profile_model.dart';
import 'package:internship_app/providers/student_profile_provider.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  static const _primary = Color(0xFF3B82F6);
  static const _bg = Color(0xFFF8FAFC);

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<StudentProfileProvider>().loadAll();
    });
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<StudentProfileProvider>();

    return Scaffold(
      backgroundColor: _bg,
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            if (provider.state == LoadState.loading)
              const SliverFillRemaining(
                child: Center(child: CircularProgressIndicator()),
              )
            else
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    // ── Profile header ─────────────────────────────────────
                    _card(
                      child: Column(
                        children: [
                          // Avatar
                          GestureDetector(
                            onTap: () => _pickAndUploadProfilePicture(provider),
                            child: Container(
                              width: 90,
                              height: 90,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                    color: Colors.grey.shade300, width: 2),
                              ),
                              child: provider.profilePictureUrl.isNotEmpty
                                  ? ClipOval(
                                      child: Image.network(
                                        provider.profilePictureUrl,
                                        fit: BoxFit.cover,
                                        errorBuilder: (ctx, e, st) =>
                                            const _CameraPlaceholder(),
                                      ),
                                    )
                                  : const _CameraPlaceholder(),
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            provider.name.isNotEmpty
                                ? provider.name
                                : 'Student',
                            style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF1E293B)),
                          ),
                          const SizedBox(height: 4),
                          Text(provider.email,
                              style: TextStyle(
                                  fontSize: 13, color: Colors.grey.shade500)),
                          const SizedBox(height: 16),
                          Divider(color: Colors.grey.shade100),
                          const SizedBox(height: 8),
                          _profileRow(
                            value: provider.location.isNotEmpty
                                ? provider.location
                                : 'Add Location',
                            onEdit: () => _editField(
                              label: 'Location',
                              initial: provider.location,
                              onSave: provider.updateLocation,
                            ),
                          ),
                          _profileRow(
                            value: provider.experience.isNotEmpty
                                ? provider.experience
                                : 'Add Experience',
                            onEdit: () => _editField(
                              label: 'Experience',
                              initial: provider.experience,
                              onSave: provider.updateExperience,
                            ),
                          ),
                          _profileRow(
                            value: provider.gender.isNotEmpty
                                ? provider.gender
                                : 'Add Gender',
                            onEdit: () => _editGender(provider),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 14),

                    // ── Resume ─────────────────────────────────────────────
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
                            'Your resume is the first impression you make on '
                            'potential employers. Craft it carefully to secure '
                            'your desired job or internship.',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                fontSize: 13,
                                color: Colors.grey.shade600,
                                height: 1.5),
                          ),
                          if (provider.resume != null) ...[
                            const SizedBox(height: 10),
                            Text(provider.resume!.fileName,
                                style: const TextStyle(
                                    color: _primary,
                                    fontWeight: FontWeight.w600,
                                    fontSize: 14)),
                            const SizedBox(height: 10),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(provider.resume!.uploadedAt,
                                    style: TextStyle(
                                        fontSize: 13,
                                        color: Colors.grey.shade600)),
                                Row(children: [
                                  IconButton(
                                    icon: const Icon(Icons.download_rounded,
                                        color: _primary, size: 22),
                                    onPressed: () => _openUrl(provider.resume!.url),
                                    padding: EdgeInsets.zero,
                                    constraints: const BoxConstraints(),
                                  ),
                                  const SizedBox(width: 12),
                                  IconButton(
                                    icon: const Icon(Icons.delete_rounded,
                                        color: Color(0xFFEF4444), size: 22),
                                    onPressed: () => provider.deleteResume(),
                                    padding: EdgeInsets.zero,
                                    constraints: const BoxConstraints(),
                                  ),
                                ]),
                              ],
                            ),
                          ],
                          const SizedBox(height: 12),
                          OutlinedButton(
                            onPressed: () => _pickAndUploadResume(provider),
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

                    // ── Education ──────────────────────────────────────────
                    _sectionCard(
                      icon: Icons.school_rounded,
                      title: 'Education',
                      required: true,
                      onAdd: () => _showAddEducationSheet(provider),
                      emptyMsg: 'No education added yet.',
                      items: List.generate(
                        provider.education.length,
                        (i) => _educationCard(
                          provider.education[i],
                          onDelete: () => provider.deleteEducation(i),
                        ),
                      ),
                    ),

                    const SizedBox(height: 14),

                    // ── Work Experience ────────────────────────────────────
                    _sectionCard(
                      icon: Icons.work_rounded,
                      title: 'Work Experience',
                      optional: true,
                      onAdd: () => _showAddWorkExpSheet(provider),
                      emptyMsg: 'No work experience added yet.',
                      items: List.generate(
                        provider.workExperience.length,
                        (i) => _workCard(
                          provider.workExperience[i],
                          onDelete: () => provider.deleteWorkExperience(i),
                        ),
                      ),
                    ),

                    const SizedBox(height: 14),

                    // ── Certificates ───────────────────────────────────────
                    _sectionCard(
                      icon: Icons.verified_rounded,
                      title: 'Certificates',
                      optional: true,
                      onAdd: () => _showAddCertSheet(provider),
                      emptyMsg: 'No certificates added yet.',
                      items: List.generate(
                        provider.certificates.length,
                        (i) => _certificateCard(
                          provider.certificates[i],
                          onDelete: () => provider.deleteCertificate(i),
                        ),
                      ),
                    ),

                    const SizedBox(height: 14),

                    // ── Personal Projects ──────────────────────────────────
                    _sectionCard(
                      icon: Icons.laptop_mac_rounded,
                      title: 'Personal Projects',
                      optional: true,
                      onAdd: () => _showAddProjectSheet(provider),
                      emptyMsg: 'No personal projects added yet.',
                      items: List.generate(
                        provider.projects.length,
                        (i) => _projectCard(
                          provider.projects[i],
                          onDelete: () => provider.deleteProject(i),
                        ),
                      ),
                    ),

                    const SizedBox(height: 14),

                    // ── Skills ─────────────────────────────────────────────
                    _sectionCard(
                      icon: Icons.handyman_rounded,
                      title: 'Skills',
                      required: true,
                      onAdd: () => _showAddSkillSheet(provider),
                      emptyMsg: 'No skills added yet.',
                      items: List.generate(
                        provider.skills.length,
                        (i) => _skillCard(
                          provider.skills[i],
                          onDelete: () => provider.deleteSkill(i),
                        ),
                      ),
                    ),

                    const SizedBox(height: 14),

                    // ── Portfolio ──────────────────────────────────────────
                    _sectionCard(
                      icon: Icons.link_rounded,
                      title: 'Portfolio',
                      optional: true,
                      onAdd: () => _showAddPortfolioSheet(provider),
                      emptyMsg: 'No portfolio links added yet.',
                      items: List.generate(
                        provider.portfolioLinks.length,
                        (i) => _portfolioCard(
                          provider.portfolioLinks[i],
                          onDelete: () => provider.deletePortfolioLink(i),
                        ),
                      ),
                    ),

                    const SizedBox(height: 14),

                    // ── Logout ─────────────────────────────────────────────
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
                        onTap: () async {
                          await AuthStorage.clear();
                          if (!context.mounted) return;
                          Navigator.pushAndRemoveUntil(
                            context,
                            MaterialPageRoute(
                                builder: (_) => const ChooseRoleScreen()),
                            (_) => false,
                          );
                        },
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

  // ── Section card ──────────────────────────────────────────────────────────────
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
                  padding: const EdgeInsets.symmetric(
                      horizontal: 10, vertical: 5),
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
                  style:
                      TextStyle(color: Colors.grey.shade500, fontSize: 13)),
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

  // ── Item cards ────────────────────────────────────────────────────────────────
  Widget _educationCard(EducationModel e,
      {required VoidCallback onDelete}) {
    return _itemContainer(
      onDelete: onDelete,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(e.degree,
            style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
                color: Color(0xFF1E293B))),
        if (e.field.isNotEmpty)
          Text(e.field,
              style: TextStyle(fontSize: 13, color: Colors.grey.shade600)),
        if (e.institute.isNotEmpty)
          Text(e.institute,
              style: TextStyle(fontSize: 13, color: Colors.grey.shade600)),
        if (e.year.trim() != '-')
          Text(e.year,
              style: TextStyle(fontSize: 12, color: Colors.grey.shade500)),
        if (e.score.isNotEmpty) ...[
          const SizedBox(height: 4),
          Text('Score: ${e.score}',
              style: const TextStyle(
                  color: _primary,
                  fontWeight: FontWeight.w600,
                  fontSize: 13)),
        ],
      ]),
    );
  }

  Widget _workCard(WorkExperienceModel e,
      {required VoidCallback onDelete}) {
    return _itemContainer(
      onDelete: onDelete,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('${e.role} at ${e.company}',
            style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
                color: Color(0xFF1E293B))),
        if (e.type.isNotEmpty)
          Text(e.type,
              style: const TextStyle(color: _primary, fontSize: 13)),
        if (e.duration.trim() != '-')
          Text('Duration: ${e.duration}',
              style: TextStyle(
                  fontSize: 12, color: Colors.grey.shade500)),
        if (e.description.isNotEmpty)
          Text(e.description,
              style: TextStyle(
                  fontSize: 13, color: Colors.grey.shade600)),
      ]),
    );
  }

  Widget _certificateCard(CertificateModel c,
      {required VoidCallback onDelete}) {
    return _itemContainer(
      onDelete: onDelete,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(c.name,
            style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
                color: Color(0xFF1E293B))),
        if (c.issuer.isNotEmpty)
          Text(c.issuer,
              style: TextStyle(fontSize: 13, color: Colors.grey.shade600)),
        if (c.date.isNotEmpty)
          Text(c.date,
              style: TextStyle(fontSize: 12, color: Colors.grey.shade500)),
      ]),
    );
  }

  Widget _projectCard(ProjectModel p, {required VoidCallback onDelete}) {
    return _itemContainer(
      onDelete: onDelete,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(p.title,
            style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
                color: Color(0xFF1E293B))),
        if (p.description.isNotEmpty)
          Text(p.description,
              style: TextStyle(fontSize: 13, color: Colors.grey.shade600)),
        if (p.link.isNotEmpty)
          Text(p.link,
              style: const TextStyle(color: _primary, fontSize: 13)),
      ]),
    );
  }

  Widget _skillCard(SkillModel s, {required VoidCallback onDelete}) {
    const levelColors = {
      'Beginner': Color(0xFF10B981),
      'Intermediate': Color(0xFFF59E0B),
      'Advanced': Color(0xFFEF4444),
    };
    final color = levelColors[s.level] ?? _primary;
    return _itemContainer(
      onDelete: onDelete,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(s.name,
            style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
                color: Color(0xFF1E293B))),
        const SizedBox(height: 6),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.15),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(s.level,
              style: TextStyle(
                  color: color,
                  fontSize: 12,
                  fontWeight: FontWeight.w600)),
        ),
      ]),
    );
  }

  Widget _portfolioCard(PortfolioLinkModel p,
      {required VoidCallback onDelete}) {
    return _itemContainer(
      onDelete: onDelete,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        if (p.label.isNotEmpty)
          Text(p.label,
              style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                  color: Color(0xFF1E293B))),
        Text(p.url,
            style: const TextStyle(color: _primary, fontSize: 13)),
      ]),
    );
  }

  Widget _itemContainer(
      {required Widget child, required VoidCallback onDelete}) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFF1F5F9),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(child: child),
          Row(mainAxisSize: MainAxisSize.min, children: [
            IconButton(
              icon: const Icon(Icons.edit, color: _primary, size: 18),
              onPressed: () {},
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
          ]),
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

  Widget _profileRow(
      {required String value, required VoidCallback onEdit}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(value,
              style:
                  TextStyle(fontSize: 13, color: Colors.grey.shade700)),
          const SizedBox(width: 6),
          GestureDetector(
              onTap: onEdit,
              child: const Icon(Icons.edit, size: 14, color: Colors.grey)),
        ],
      ),
    );
  }

  // ── Bottom sheets ─────────────────────────────────────────────────────────────
  void _editField({
    required String label,
    required String initial,
    required Future<void> Function(String) onSave,
  }) {
    final ctrl = TextEditingController(text: initial);
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
            Text('Edit $label',
                style: const TextStyle(
                    fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _sheetField(ctrl, label),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                    backgroundColor: _primary,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12))),
                onPressed: () async {
                  Navigator.pop(context);
                  await onSave(ctrl.text.trim());
                },
                child: const Text('Save',
                    style: TextStyle(
                        color: Colors.white, fontWeight: FontWeight.w700)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _editGender(StudentProfileProvider provider) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(height: 16),
          const Text('Select Gender',
              style:
                  TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          ...['Male', 'Female', 'Other'].map((g) => ListTile(
                title: Text(g),
                leading: Icon(
                  provider.gender == g
                      ? Icons.radio_button_checked
                      : Icons.radio_button_unchecked,
                  color: _primary,
                ),
                onTap: () async {
                  Navigator.pop(context);
                  await provider.updateGender(g);
                },
              )),
          const SizedBox(height: 8),
        ],
      ),
    );
  }

  void _showAddEducationSheet(StudentProfileProvider provider) {
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
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Add Education',
                  style: TextStyle(
                      fontSize: 18, fontWeight: FontWeight.bold)),
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
                      Navigator.pop(context);
                      provider.addEducation({
                        'degree': degreeCtrl.text.trim(),
                        'field': fieldCtrl.text.trim(),
                        'institute': instituteCtrl.text.trim(),
                        'year': yearCtrl.text.trim(),
                        'score': scoreCtrl.text.trim(),
                      });
                    }
                  },
                  child: const Text('Add',
                      style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w700)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showAddProjectSheet(StudentProfileProvider provider) {
    final titleCtrl = TextEditingController();
    final descCtrl = TextEditingController();
    final linkCtrl = TextEditingController();

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
            const Text('Add Project',
                style: TextStyle(
                    fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _sheetField(titleCtrl, 'Project Title'),
            _sheetField(descCtrl, 'Description'),
            _sheetField(linkCtrl, 'Project Link (optional)'),
            const SizedBox(height: 8),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                    backgroundColor: _primary,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12))),
                onPressed: () async {
                  if (titleCtrl.text.isNotEmpty) {
                    Navigator.pop(context);
                    await provider.addProject({
                      'title': titleCtrl.text.trim(),
                      'description': descCtrl.text.trim(),
                      'link': linkCtrl.text.trim(),
                    });
                  }
                },
                child: const Text('Add',
                    style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w700)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showAddSkillSheet(StudentProfileProvider provider) {
    final nameCtrl = TextEditingController();
    String level = 'Beginner';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => StatefulBuilder(
        builder: (_, setSheet) => Padding(
          padding: EdgeInsets.fromLTRB(
              20, 20, 20, MediaQuery.viewInsetsOf(context).bottom + 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Add Skill',
                  style: TextStyle(
                      fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              _sheetField(nameCtrl, 'Skill Name (e.g. React.js)'),
              const Text('Level',
                  style: TextStyle(fontSize: 13, color: Colors.grey)),
              const SizedBox(height: 8),
              Row(
                children: ['Beginner', 'Intermediate', 'Advanced']
                    .map((l) {
                  final selected = level == l;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: GestureDetector(
                      onTap: () => setSheet(() => level = l),
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
                                color: selected
                                    ? Colors.white
                                    : _primary,
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
                  onPressed: () async {
                    if (nameCtrl.text.isNotEmpty) {
                      Navigator.pop(context);
                      provider.addSkill({
                        'skill': nameCtrl.text.trim(),
                        'level': level,
                      });
                    }
                  },
                  child: const Text('Add',
                      style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w700)),
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
          hintStyle:
              const TextStyle(color: Colors.grey, fontSize: 13),
          filled: true,
          fillColor: const Color(0xFFF1F5F9),
          contentPadding: const EdgeInsets.symmetric(
              horizontal: 14, vertical: 12),
          border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: BorderSide.none),
        ),
      ),
    );
  }

  Future<void> _pickAndUploadProfilePicture(
      StudentProfileProvider provider) async {
    final picker = ImagePicker();
    final picked =
        await picker.pickImage(source: ImageSource.gallery, imageQuality: 80);
    if (picked == null) return;
    final bytes = await picked.readAsBytes();
    final ok = await provider.uploadProfilePicture(
        bytes.toList(), picked.name);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(ok ? 'Profile picture updated!' : 'Upload failed.'),
        backgroundColor: ok ? _primary : Colors.red,
      ));
    }
  }

  Future<void> _pickAndUploadResume(StudentProfileProvider provider) async {
    final picker = ImagePicker();
    // image_picker doesn't support PDFs; show a snackbar directing user
    // to use a file picker package. For now pick from gallery as fallback.
    final picked = await picker.pickImage(source: ImageSource.gallery);
    if (picked == null) return;
    final bytes = await picked.readAsBytes();
    final ok =
        await provider.uploadResume(bytes.toList(), picked.name);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(ok ? 'Resume uploaded!' : 'Upload failed.'),
        backgroundColor: ok ? _primary : Colors.red,
      ));
    }
  }

  void _openUrl(String url) {
    // URL launching requires url_launcher; show snackbar with the URL for now
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(url.isNotEmpty ? url : 'No URL available'),
        backgroundColor: _primary,
      ),
    );
  }

  void _showAddWorkExpSheet(StudentProfileProvider provider) {
    final roleCtrl = TextEditingController();
    final companyCtrl = TextEditingController();
    final typeCtrl = TextEditingController();
    final durationCtrl = TextEditingController();
    final descCtrl = TextEditingController();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => Padding(
        padding: EdgeInsets.fromLTRB(
            20, 20, 20, MediaQuery.viewInsetsOf(context).bottom + 20),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Add Work Experience',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              _sheetField(roleCtrl, 'Role / Title'),
              _sheetField(companyCtrl, 'Company / Organization'),
              _sheetField(typeCtrl, 'Type (e.g. Job, Internship)'),
              _sheetField(durationCtrl, 'Duration (e.g. Jun 2023 - Dec 2023)'),
              _sheetField(descCtrl, 'Description'),
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
                    if (roleCtrl.text.isNotEmpty) {
                      Navigator.pop(context);
                      provider.addWorkExperience({
                        'role': roleCtrl.text.trim(),
                        'company': companyCtrl.text.trim(),
                        'type': typeCtrl.text.trim(),
                        'duration': durationCtrl.text.trim(),
                        'description': descCtrl.text.trim(),
                      });
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

  void _showAddCertSheet(StudentProfileProvider provider) {
    final nameCtrl = TextEditingController();
    final issuerCtrl = TextEditingController();
    final dateCtrl = TextEditingController();
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
            const Text('Add Certificate',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _sheetField(nameCtrl, 'Certificate Name'),
            _sheetField(issuerCtrl, 'Issuing Organization'),
            _sheetField(dateCtrl, 'Issue Date (e.g. Jan 2024)'),
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
                  if (nameCtrl.text.isNotEmpty) {
                    Navigator.pop(context);
                    provider.addCertificate({
                      'name': nameCtrl.text.trim(),
                      'issuer': issuerCtrl.text.trim(),
                      'date': dateCtrl.text.trim(),
                    });
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

  void _showAddPortfolioSheet(StudentProfileProvider provider) {
    final labelCtrl = TextEditingController();
    final urlCtrl = TextEditingController();
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
            const Text('Add Portfolio Link',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _sheetField(labelCtrl, 'Label (e.g. GitHub, LinkedIn)'),
            _sheetField(urlCtrl, 'URL (https://...)'),
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
                  if (urlCtrl.text.isNotEmpty) {
                    Navigator.pop(context);
                    provider.addPortfolioLink({
                      'label': labelCtrl.text.trim(),
                      'url': urlCtrl.text.trim(),
                    });
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
            leading:
                const Icon(Icons.notifications_outlined, color: _primary),
            title: const Text('Notifications'),
            onTap: () => Navigator.pop(context),
          ),
          ListTile(
            leading:
                const Icon(Icons.help_outline, color: _primary),
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

class _CameraPlaceholder extends StatelessWidget {
  const _CameraPlaceholder();

  @override
  Widget build(BuildContext context) {
    return const CircleAvatar(
      backgroundColor: Color(0xFFEFF2F7),
      child: Icon(Icons.camera_alt_outlined, color: Colors.grey, size: 32),
    );
  }
}
