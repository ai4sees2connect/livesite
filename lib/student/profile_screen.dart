import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'package:internship_app/core/storage/auth_storage.dart';
import 'package:internship_app/main.dart';
import 'package:internship_app/models/student_profile_model.dart';
import 'package:internship_app/providers/student_profile_provider.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _pickingImage = false;

  static const _primary = Color(0xFF3B82F6);
  static const _primaryDark = Color(0xFF1D4ED8);
  static const _bg = Color(0xFFF1F5F9);
  static const _surface = Colors.white;
  static const _textDark = Color(0xFF0F172A);
  static const _textMid = Color(0xFF475569);
  static const _textLight = Color(0xFF94A3B8);
  static const _danger = Color(0xFFEF4444);

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<StudentProfileProvider>().loadAll();
    });
  }

  @override
  Widget build(BuildContext context) {
    final pv = context.watch<StudentProfileProvider>();

    if (pv.state == LoadState.loading) {
      return const Scaffold(
        backgroundColor: _bg,
        body: Center(
          child: CircularProgressIndicator(color: _primary),
        ),
      );
    }

    return Scaffold(
      backgroundColor: _bg,
      body: CustomScrollView(
        slivers: [
          // ── Hero header sliver ──────────────────────────────────────────────
          SliverToBoxAdapter(child: _buildHero(pv)),

          // ── Content ─────────────────────────────────────────────────────────
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 32),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                const SizedBox(height: 16),
                _buildInfoChips(pv),
                const SizedBox(height: 16),
                _buildResumeCard(pv),
                const SizedBox(height: 14),
                _buildSection(
                  icon: Icons.school_rounded,
                  iconColor: const Color(0xFF6366F1),
                  iconBg: const Color(0xFFEEF2FF),
                  title: 'Education',
                  badge: 'Required',
                  badgeColor: const Color(0xFF6366F1),
                  onAdd: () => _showAddEducationSheet(pv),
                  emptyMsg: 'Add your educational background',
                  emptyIcon: Icons.school_outlined,
                  items: List.generate(pv.education.length,
                      (i) => _eduItem(pv.education[i], () => pv.deleteEducation(i))),
                ),
                const SizedBox(height: 14),
                _buildSection(
                  icon: Icons.work_rounded,
                  iconColor: const Color(0xFF0EA5E9),
                  iconBg: const Color(0xFFE0F2FE),
                  title: 'Work Experience',
                  onAdd: () => _showAddWorkExpSheet(pv),
                  emptyMsg: 'Add your work history',
                  emptyIcon: Icons.business_center_outlined,
                  items: List.generate(pv.workExperience.length,
                      (i) => _workItem(pv.workExperience[i], () => pv.deleteWorkExperience(i))),
                ),
                const SizedBox(height: 14),
                _buildSection(
                  icon: Icons.verified_rounded,
                  iconColor: const Color(0xFF10B981),
                  iconBg: const Color(0xFFD1FAE5),
                  title: 'Certificates',
                  onAdd: () => _showAddCertSheet(pv),
                  emptyMsg: 'Add your certifications',
                  emptyIcon: Icons.card_membership_outlined,
                  items: List.generate(pv.certificates.length,
                      (i) => _certItem(pv.certificates[i], () => pv.deleteCertificate(i))),
                ),
                const SizedBox(height: 14),
                _buildSection(
                  icon: Icons.rocket_launch_rounded,
                  iconColor: const Color(0xFFF59E0B),
                  iconBg: const Color(0xFFFEF3C7),
                  title: 'Personal Projects',
                  onAdd: () => _showAddProjectSheet(pv),
                  emptyMsg: 'Showcase your side projects',
                  emptyIcon: Icons.laptop_mac_outlined,
                  items: List.generate(pv.projects.length,
                      (i) => _projectItem(pv.projects[i], () => pv.deleteProject(i))),
                ),
                const SizedBox(height: 14),
                _buildSkillsSection(pv),
                const SizedBox(height: 14),
                _buildSection(
                  icon: Icons.travel_explore_rounded,
                  iconColor: const Color(0xFFEC4899),
                  iconBg: const Color(0xFFFCE7F3),
                  title: 'Portfolio & Links',
                  onAdd: () => _showAddPortfolioSheet(pv),
                  emptyMsg: 'Add GitHub, LinkedIn, portfolio…',
                  emptyIcon: Icons.link_outlined,
                  items: List.generate(pv.portfolioLinks.length,
                      (i) => _portfolioItem(pv.portfolioLinks[i], () => pv.deletePortfolioLink(i))),
                ),
                const SizedBox(height: 24),
                _buildLogoutButton(),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  // ── Hero ──────────────────────────────────────────────────────────────────────
  Widget _buildHero(StudentProfileProvider pv) {
    return Stack(
      clipBehavior: Clip.none,
      alignment: Alignment.bottomCenter,
      children: [
        // Gradient banner
        Container(
          height: 170,
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [_primary, _primaryDark],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: SafeArea(
            bottom: false,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('My Profile',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.3)),
                  // Settings icon
                  GestureDetector(
                    onTap: () => _showMenu(context),
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.tune_rounded,
                          color: Colors.white, size: 20),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),

        // White panel below avatar
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          child: Container(
            height: 72,
            decoration: const BoxDecoration(
              color: _surface,
              borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
            ),
          ),
        ),

        // Avatar
        Positioned(
          bottom: 28,
          child: GestureDetector(
            onTap: () => _pickAndUploadProfilePicture(
                context.read<StudentProfileProvider>()),
            child: Stack(
              children: [
                Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const LinearGradient(
                      colors: [_primary, _primaryDark],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    boxShadow: [
                      BoxShadow(
                          color: _primary.withValues(alpha: 0.4),
                          blurRadius: 16,
                          offset: const Offset(0, 4)),
                    ],
                  ),
                  padding: const EdgeInsets.all(3),
                  child: ClipOval(
                    child: pv.profilePictureUrl.isNotEmpty
                        ? Image.network(pv.profilePictureUrl,
                            fit: BoxFit.cover,
                            errorBuilder: (_, e, st) =>
                                const _AvatarPlaceholder())
                        : const _AvatarPlaceholder(),
                  ),
                ),
                Positioned(
                  right: 0,
                  bottom: 0,
                  child: Container(
                    padding: const EdgeInsets.all(5),
                    decoration: BoxDecoration(
                      color: _primary,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 2),
                    ),
                    child: const Icon(Icons.camera_alt_rounded,
                        color: Colors.white, size: 12),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // ── Info chips row ────────────────────────────────────────────────────────────
  Widget _buildInfoChips(StudentProfileProvider pv) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: _cardDeco(),
      child: Column(
        children: [
          Text(
            pv.name.isNotEmpty ? pv.name : 'Student Name',
            style: const TextStyle(
                fontSize: 22, fontWeight: FontWeight.bold, color: _textDark),
          ),
          const SizedBox(height: 4),
          if (pv.email.isNotEmpty)
            Text(pv.email,
                style: const TextStyle(fontSize: 13, color: _textLight)),
          const SizedBox(height: 16),
          Wrap(
            alignment: WrapAlignment.center,
            spacing: 8,
            runSpacing: 8,
            children: [
              _infoChip(
                icon: Icons.location_on_rounded,
                label: pv.location.isNotEmpty ? pv.location : 'Location',
                isEmpty: pv.location.isEmpty,
                onTap: () => _editField(
                  label: 'Location',
                  initial: pv.location,
                  onSave: pv.updateLocation,
                ),
              ),
              _infoChip(
                icon: Icons.work_history_rounded,
                label: pv.experience.isNotEmpty
                    ? '${pv.experience} exp'
                    : 'Experience',
                isEmpty: pv.experience.isEmpty,
                onTap: () => _editField(
                  label: 'Experience',
                  initial: pv.experience,
                  onSave: pv.updateExperience,
                ),
              ),
              _infoChip(
                icon: Icons.person_rounded,
                label: pv.gender.isNotEmpty ? pv.gender : 'Gender',
                isEmpty: pv.gender.isEmpty,
                onTap: () => _editGender(pv),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _infoChip({
    required IconData icon,
    required String label,
    required bool isEmpty,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isEmpty
              ? const Color(0xFFF8FAFC)
              : _primary.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isEmpty
                ? const Color(0xFFE2E8F0)
                : _primary.withValues(alpha: 0.25),
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon,
                size: 14,
                color: isEmpty ? _textLight : _primary),
            const SizedBox(width: 6),
            Text(label,
                style: TextStyle(
                    fontSize: 13,
                    color: isEmpty ? _textLight : _textDark,
                    fontWeight: isEmpty ? FontWeight.normal : FontWeight.w600)),
            const SizedBox(width: 4),
            Icon(Icons.edit_rounded,
                size: 11, color: isEmpty ? _textLight : _primary),
          ],
        ),
      ),
    );
  }

  // ── Resume ────────────────────────────────────────────────────────────────────
  Widget _buildResumeCard(StudentProfileProvider pv) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: _cardDeco(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF7ED),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.description_rounded,
                    color: Color(0xFFF97316), size: 20),
              ),
              const SizedBox(width: 12),
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Resume',
                      style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: _textDark)),
                  Text('PDF · Max 5MB',
                      style: TextStyle(fontSize: 12, color: _textLight)),
                ],
              ),
              const Spacer(),
              GestureDetector(
                onTap: () => _pickAndUploadResume(pv),
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                  decoration: BoxDecoration(
                    color: _primary,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Text('Upload',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 13,
                          fontWeight: FontWeight.w700)),
                ),
              ),
            ],
          ),
          if (pv.resume != null) ...[
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEF4444).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.picture_as_pdf_rounded,
                        color: Color(0xFFEF4444), size: 20),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(pv.resume!.fileName,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: _textDark)),
                        Text(pv.resume!.uploadedAt,
                            style: const TextStyle(
                                fontSize: 11, color: _textLight)),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.download_rounded,
                        color: _primary, size: 20),
                    onPressed: () => _openUrl(pv.resume!.url),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                  const SizedBox(width: 12),
                  IconButton(
                    icon: const Icon(Icons.delete_rounded,
                        color: _danger, size: 20),
                    onPressed: () => pv.deleteResume(),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                ],
              ),
            ),
          ] else ...[
            const SizedBox(height: 14),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 20),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                    color: const Color(0xFFE2E8F0), style: BorderStyle.solid),
              ),
              child: const Column(
                children: [
                  Icon(Icons.upload_file_rounded,
                      size: 32, color: _textLight),
                  SizedBox(height: 6),
                  Text('No resume uploaded yet',
                      style: TextStyle(fontSize: 13, color: _textLight)),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  // ── Generic section ───────────────────────────────────────────────────────────
  Widget _buildSection({
    required IconData icon,
    required Color iconColor,
    required Color iconBg,
    required String title,
    required VoidCallback onAdd,
    required String emptyMsg,
    required IconData emptyIcon,
    required List<Widget> items,
    String? badge,
    Color? badgeColor,
  }) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: _cardDeco(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                    color: iconBg, borderRadius: BorderRadius.circular(10)),
                child: Icon(icon, color: iconColor, size: 18),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Row(
                  children: [
                    Text(title,
                        style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: _textDark)),
                    if (badge != null) ...[
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: (badgeColor ?? _primary)
                              .withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(badge,
                            style: TextStyle(
                                fontSize: 10,
                                color: badgeColor ?? _primary,
                                fontWeight: FontWeight.w700)),
                      ),
                    ],
                  ],
                ),
              ),
              GestureDetector(
                onTap: onAdd,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: _primary,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.add_rounded, color: Colors.white, size: 14),
                      SizedBox(width: 4),
                      Text('Add',
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w700)),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          if (items.isEmpty)
            _emptyState(emptyMsg, emptyIcon)
          else
            ...items.map((w) => Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: w,
                )),
        ],
      ),
    );
  }

  Widget _emptyState(String msg, IconData icon) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 24),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: [
          Icon(icon, size: 28, color: _textLight),
          const SizedBox(height: 8),
          Text(msg,
              style: const TextStyle(fontSize: 13, color: _textLight)),
        ],
      ),
    );
  }

  // ── Skills section (chips) ────────────────────────────────────────────────────
  Widget _buildSkillsSection(StudentProfileProvider pv) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: _cardDeco(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                    color: const Color(0xFFE0F2FE),
                    borderRadius: BorderRadius.circular(10)),
                child: const Icon(Icons.auto_awesome_rounded,
                    color: Color(0xFF0EA5E9), size: 18),
              ),
              const SizedBox(width: 10),
              const Expanded(
                child: Row(
                  children: [
                    Text('Skills',
                        style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: _textDark)),
                    SizedBox(width: 8),
                    _RequiredBadge(),
                  ],
                ),
              ),
              GestureDetector(
                onTap: () => _showAddSkillSheet(pv),
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: _primary,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.add_rounded, color: Colors.white, size: 14),
                      SizedBox(width: 4),
                      Text('Add',
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w700)),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          if (pv.skills.isEmpty)
            _emptyState('Add skills like React, Python, Figma…',
                Icons.extension_outlined)
          else
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: List.generate(pv.skills.length, (i) {
                final s = pv.skills[i];
                const levelColors = {
                  'Beginner': Color(0xFF10B981),
                  'Intermediate': Color(0xFFF59E0B),
                  'Advanced': Color(0xFF6366F1),
                };
                final color = levelColors[s.level] ?? _primary;
                return Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 12, vertical: 7),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                        color: color.withValues(alpha: 0.3)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(s.name,
                          style: TextStyle(
                              fontSize: 13,
                              color: color,
                              fontWeight: FontWeight.w600)),
                      const SizedBox(width: 6),
                      GestureDetector(
                        onTap: () => pv.deleteSkill(i),
                        child: Icon(Icons.close_rounded,
                            size: 14, color: color),
                      ),
                    ],
                  ),
                );
              }),
            ),
        ],
      ),
    );
  }

  // ── Item widgets ──────────────────────────────────────────────────────────────
  Widget _eduItem(EducationModel e, VoidCallback onDelete) {
    return _itemCard(
      accentColor: const Color(0xFF6366F1),
      onDelete: onDelete,
      icon: Icons.school_rounded,
      iconColor: const Color(0xFF6366F1),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(e.degree,
            style: const TextStyle(
                fontWeight: FontWeight.bold, fontSize: 14, color: _textDark)),
        if (e.field.isNotEmpty) ...[
          const SizedBox(height: 2),
          Text(e.field,
              style: const TextStyle(fontSize: 13, color: _textMid)),
        ],
        if (e.institute.isNotEmpty) ...[
          const SizedBox(height: 2),
          Text(e.institute,
              style: const TextStyle(fontSize: 12, color: _textLight)),
        ],
        if (e.year.trim().isNotEmpty && e.year.trim() != '-') ...[
          const SizedBox(height: 4),
          Row(children: [
            const Icon(Icons.calendar_today_rounded,
                size: 11, color: _textLight),
            const SizedBox(width: 4),
            Text(e.year,
                style: const TextStyle(fontSize: 11, color: _textLight)),
            if (e.score.isNotEmpty) ...[
              const SizedBox(width: 12),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFF6366F1).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(e.score,
                    style: const TextStyle(
                        fontSize: 11,
                        color: Color(0xFF6366F1),
                        fontWeight: FontWeight.w600)),
              ),
            ],
          ]),
        ],
      ]),
    );
  }

  Widget _workItem(WorkExperienceModel e, VoidCallback onDelete) {
    return _itemCard(
      accentColor: const Color(0xFF0EA5E9),
      onDelete: onDelete,
      icon: Icons.work_rounded,
      iconColor: const Color(0xFF0EA5E9),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(e.role,
            style: const TextStyle(
                fontWeight: FontWeight.bold, fontSize: 14, color: _textDark)),
        if (e.company.isNotEmpty) ...[
          const SizedBox(height: 2),
          Text(e.company,
              style: const TextStyle(fontSize: 13, color: _textMid)),
        ],
        const SizedBox(height: 4),
        Row(children: [
          if (e.type.isNotEmpty)
            _tag(e.type, const Color(0xFF0EA5E9)),
          if (e.duration.trim().isNotEmpty && e.duration.trim() != '-') ...[
            const SizedBox(width: 8),
            const Icon(Icons.schedule_rounded, size: 11, color: _textLight),
            const SizedBox(width: 3),
            Text(e.duration,
                style: const TextStyle(fontSize: 11, color: _textLight)),
          ],
        ]),
        if (e.description.isNotEmpty) ...[
          const SizedBox(height: 4),
          Text(e.description,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 12, color: _textLight)),
        ],
      ]),
    );
  }

  Widget _certItem(CertificateModel c, VoidCallback onDelete) {
    return _itemCard(
      accentColor: const Color(0xFF10B981),
      onDelete: onDelete,
      icon: Icons.verified_rounded,
      iconColor: const Color(0xFF10B981),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(c.name,
            style: const TextStyle(
                fontWeight: FontWeight.bold, fontSize: 14, color: _textDark)),
        if (c.issuer.isNotEmpty) ...[
          const SizedBox(height: 2),
          Text(c.issuer,
              style: const TextStyle(fontSize: 13, color: _textMid)),
        ],
        if (c.date.isNotEmpty) ...[
          const SizedBox(height: 4),
          Row(children: [
            const Icon(Icons.calendar_today_rounded,
                size: 11, color: _textLight),
            const SizedBox(width: 4),
            Text(c.date,
                style: const TextStyle(fontSize: 11, color: _textLight)),
          ]),
        ],
      ]),
    );
  }

  Widget _projectItem(ProjectModel p, VoidCallback onDelete) {
    return _itemCard(
      accentColor: const Color(0xFFF59E0B),
      onDelete: onDelete,
      icon: Icons.rocket_launch_rounded,
      iconColor: const Color(0xFFF59E0B),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(p.title,
            style: const TextStyle(
                fontWeight: FontWeight.bold, fontSize: 14, color: _textDark)),
        if (p.description.isNotEmpty) ...[
          const SizedBox(height: 4),
          Text(p.description,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 12, color: _textLight)),
        ],
        if (p.link.isNotEmpty) ...[
          const SizedBox(height: 6),
          Row(children: [
            const Icon(Icons.link_rounded, size: 12, color: _primary),
            const SizedBox(width: 4),
            Expanded(
              child: Text(p.link,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                      fontSize: 12,
                      color: _primary,
                      fontWeight: FontWeight.w500)),
            ),
          ]),
        ],
      ]),
    );
  }

  Widget _portfolioItem(PortfolioLinkModel p, VoidCallback onDelete) {
    final icon = _portfolioIcon(p.label);
    return _itemCard(
      accentColor: const Color(0xFFEC4899),
      onDelete: onDelete,
      icon: icon,
      iconColor: const Color(0xFFEC4899),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        if (p.label.isNotEmpty)
          Text(p.label,
              style: const TextStyle(
                  fontWeight: FontWeight.bold, fontSize: 14, color: _textDark)),
        const SizedBox(height: 2),
        Text(p.url,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 12, color: _primary)),
      ]),
    );
  }

  IconData _portfolioIcon(String label) {
    final l = label.toLowerCase();
    if (l.contains('github')) return Icons.code_rounded;
    if (l.contains('linkedin')) return Icons.person_pin_rounded;
    if (l.contains('twitter') || l.contains('x.com')) return Icons.tag_rounded;
    if (l.contains('youtube')) return Icons.play_circle_rounded;
    return Icons.travel_explore_rounded;
  }

  Widget _itemCard({
    required Color accentColor,
    required VoidCallback onDelete,
    required IconData icon,
    required Color iconColor,
    required Widget child,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.03),
              blurRadius: 4,
              offset: const Offset(0, 1)),
        ],
      ),
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Left accent bar
            Container(
              width: 4,
              decoration: BoxDecoration(
                color: accentColor,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(12),
                  bottomLeft: Radius.circular(12),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Icon(icon, color: iconColor, size: 18),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(0, 12, 8, 12),
                child: child,
              ),
            ),
            IconButton(
              icon: const Icon(Icons.delete_outline_rounded,
                  color: _danger, size: 18),
              onPressed: onDelete,
              padding: const EdgeInsets.all(8),
              constraints: const BoxConstraints(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _tag(String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(label,
          style: TextStyle(
              fontSize: 11, color: color, fontWeight: FontWeight.w600)),
    );
  }

  // ── Logout ────────────────────────────────────────────────────────────────────
  Widget _buildLogoutButton() {
    return GestureDetector(
      onTap: () async {
        await AuthStorage.clear();
        if (!mounted) return;
        AppRestarter.restart(context);
      },
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 15),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: _danger.withValues(alpha: 0.4)),
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.logout_rounded, color: _danger, size: 18),
            SizedBox(width: 8),
            Text('Sign Out',
                style: TextStyle(
                    color: _danger,
                    fontWeight: FontWeight.w700,
                    fontSize: 15)),
          ],
        ),
      ),
    );
  }

  // ── Card decoration ───────────────────────────────────────────────────────────
  BoxDecoration _cardDeco() {
    return BoxDecoration(
      color: _surface,
      borderRadius: BorderRadius.circular(16),
      boxShadow: [
        BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, 2)),
      ],
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
      backgroundColor: Colors.transparent,
      builder: (_) => _SheetWrapper(
        title: 'Edit $label',
        child: Column(
          children: [
            _sheetField(ctrl, label, icon: Icons.edit_rounded),
            const SizedBox(height: 4),
            _sheetSaveBtn(onPressed: () async {
              Navigator.pop(context);
              await onSave(ctrl.text.trim());
            }),
          ],
        ),
      ),
    );
  }

  void _editGender(StudentProfileProvider pv) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => _SheetWrapper(
        title: 'Select Gender',
        child: Column(
          children: ['Male', 'Female', 'Other'].map((g) {
            final selected = pv.gender == g;
            return GestureDetector(
              onTap: () async {
                Navigator.pop(context);
                await pv.updateGender(g);
              },
              child: Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: selected
                      ? _primary.withValues(alpha: 0.08)
                      : const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: selected ? _primary : const Color(0xFFE2E8F0),
                    width: selected ? 1.5 : 1,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      selected
                          ? Icons.radio_button_checked
                          : Icons.radio_button_unchecked,
                      color: selected ? _primary : _textLight,
                      size: 18,
                    ),
                    const SizedBox(width: 12),
                    Text(g,
                        style: TextStyle(
                            fontSize: 15,
                            fontWeight: selected
                                ? FontWeight.w600
                                : FontWeight.normal,
                            color: selected ? _textDark : _textMid)),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  void _showAddEducationSheet(StudentProfileProvider pv) {
    final degreeCtrl = TextEditingController();
    final fieldCtrl = TextEditingController();
    final instituteCtrl = TextEditingController();
    final yearCtrl = TextEditingController();
    final scoreCtrl = TextEditingController();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _SheetWrapper(
        title: 'Add Education',
        scrollable: true,
        child: Column(
          children: [
            _sheetField(degreeCtrl, 'Degree (e.g. B.Tech)',
                icon: Icons.school_rounded),
            _sheetField(fieldCtrl, 'Field of Study',
                icon: Icons.menu_book_rounded),
            _sheetField(instituteCtrl, 'Institute / University',
                icon: Icons.account_balance_rounded),
            _sheetField(yearCtrl, 'Year (e.g. 2020 – 2024)',
                icon: Icons.calendar_month_rounded),
            _sheetField(scoreCtrl, 'Score / CGPA (optional)',
                icon: Icons.star_rounded),
            const SizedBox(height: 4),
            _sheetSaveBtn(
              label: 'Add Education',
              onPressed: () {
                if (degreeCtrl.text.isNotEmpty) {
                  Navigator.pop(context);
                  pv.addEducation({
                    'degree': degreeCtrl.text.trim(),
                    'field': fieldCtrl.text.trim(),
                    'institute': instituteCtrl.text.trim(),
                    'year': yearCtrl.text.trim(),
                    'score': scoreCtrl.text.trim(),
                  });
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showAddWorkExpSheet(StudentProfileProvider pv) {
    final roleCtrl = TextEditingController();
    final companyCtrl = TextEditingController();
    final typeCtrl = TextEditingController();
    final durationCtrl = TextEditingController();
    final descCtrl = TextEditingController();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _SheetWrapper(
        title: 'Add Work Experience',
        scrollable: true,
        child: Column(
          children: [
            _sheetField(roleCtrl, 'Job Title / Role',
                icon: Icons.badge_rounded),
            _sheetField(companyCtrl, 'Company / Organization',
                icon: Icons.business_rounded),
            _sheetField(typeCtrl, 'Type (Job · Internship · Freelance)',
                icon: Icons.category_rounded),
            _sheetField(durationCtrl, 'Duration (e.g. Jun 2023 – Dec 2023)',
                icon: Icons.date_range_rounded),
            _sheetField(descCtrl, 'Brief description',
                icon: Icons.notes_rounded, maxLines: 3),
            const SizedBox(height: 4),
            _sheetSaveBtn(
              label: 'Add Experience',
              onPressed: () {
                if (roleCtrl.text.isNotEmpty) {
                  Navigator.pop(context);
                  pv.addWorkExperience({
                    'role': roleCtrl.text.trim(),
                    'company': companyCtrl.text.trim(),
                    'type': typeCtrl.text.trim(),
                    'duration': durationCtrl.text.trim(),
                    'description': descCtrl.text.trim(),
                  });
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showAddCertSheet(StudentProfileProvider pv) {
    final nameCtrl = TextEditingController();
    final issuerCtrl = TextEditingController();
    final dateCtrl = TextEditingController();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _SheetWrapper(
        title: 'Add Certificate',
        child: Column(
          children: [
            _sheetField(nameCtrl, 'Certificate Name',
                icon: Icons.verified_rounded),
            _sheetField(issuerCtrl, 'Issuing Organization',
                icon: Icons.business_rounded),
            _sheetField(dateCtrl, 'Issue Date (e.g. Jan 2024)',
                icon: Icons.calendar_month_rounded),
            const SizedBox(height: 4),
            _sheetSaveBtn(
              label: 'Add Certificate',
              onPressed: () {
                if (nameCtrl.text.isNotEmpty) {
                  Navigator.pop(context);
                  pv.addCertificate({
                    'name': nameCtrl.text.trim(),
                    'issuer': issuerCtrl.text.trim(),
                    'date': dateCtrl.text.trim(),
                  });
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showAddProjectSheet(StudentProfileProvider pv) {
    final titleCtrl = TextEditingController();
    final descCtrl = TextEditingController();
    final linkCtrl = TextEditingController();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _SheetWrapper(
        title: 'Add Project',
        child: Column(
          children: [
            _sheetField(titleCtrl, 'Project Title',
                icon: Icons.rocket_launch_rounded),
            _sheetField(descCtrl, 'Description (optional)',
                icon: Icons.notes_rounded, maxLines: 3),
            _sheetField(linkCtrl, 'Project Link (optional)',
                icon: Icons.link_rounded),
            const SizedBox(height: 4),
            _sheetSaveBtn(
              label: 'Add Project',
              onPressed: () async {
                if (titleCtrl.text.isNotEmpty) {
                  Navigator.pop(context);
                  await pv.addProject({
                    'title': titleCtrl.text.trim(),
                    'description': descCtrl.text.trim(),
                    'link': linkCtrl.text.trim(),
                  });
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showAddSkillSheet(StudentProfileProvider pv) {
    final nameCtrl = TextEditingController();
    String level = 'Beginner';
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => StatefulBuilder(
        builder: (_, setSheet) => _SheetWrapper(
          title: 'Add Skill',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _sheetField(nameCtrl, 'Skill name (e.g. Flutter, Python)',
                  icon: Icons.auto_awesome_rounded),
              const Text('Proficiency Level',
                  style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: _textMid)),
              const SizedBox(height: 10),
              Row(
                children: ['Beginner', 'Intermediate', 'Advanced'].map((l) {
                  final sel = level == l;
                  const levelColors = {
                    'Beginner': Color(0xFF10B981),
                    'Intermediate': Color(0xFFF59E0B),
                    'Advanced': Color(0xFF6366F1),
                  };
                  final color = levelColors[l]!;
                  return Expanded(
                    child: GestureDetector(
                      onTap: () => setSheet(() => level = l),
                      child: Container(
                        margin: const EdgeInsets.only(right: 6),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: sel ? color : color.withValues(alpha: 0.08),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                              color: sel
                                  ? color
                                  : color.withValues(alpha: 0.3)),
                        ),
                        child: Text(l,
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                fontSize: 12,
                                color: sel ? Colors.white : color,
                                fontWeight: FontWeight.w700)),
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),
              _sheetSaveBtn(
                label: 'Add Skill',
                onPressed: () async {
                  if (nameCtrl.text.isNotEmpty) {
                    Navigator.pop(context);
                    pv.addSkill({
                      'skill': nameCtrl.text.trim(),
                      'level': level,
                    });
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showAddPortfolioSheet(StudentProfileProvider pv) {
    final labelCtrl = TextEditingController();
    final urlCtrl = TextEditingController();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _SheetWrapper(
        title: 'Add Portfolio Link',
        child: Column(
          children: [
            _sheetField(labelCtrl, 'Label (e.g. GitHub, Portfolio)',
                icon: Icons.label_rounded),
            _sheetField(urlCtrl, 'URL (https://...)',
                icon: Icons.link_rounded),
            const SizedBox(height: 4),
            _sheetSaveBtn(
              label: 'Add Link',
              onPressed: () {
                if (urlCtrl.text.isNotEmpty) {
                  Navigator.pop(context);
                  pv.addPortfolioLink({
                    'label': labelCtrl.text.trim(),
                    'url': urlCtrl.text.trim(),
                  });
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  // ── Sheet helpers ─────────────────────────────────────────────────────────────
  Widget _sheetField(TextEditingController ctrl, String hint,
      {IconData? icon, int maxLines = 1}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TextField(
        controller: ctrl,
        maxLines: maxLines,
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: const TextStyle(color: _textLight, fontSize: 13),
          prefixIcon: icon != null
              ? Icon(icon, size: 18, color: _textLight)
              : null,
          filled: true,
          fillColor: const Color(0xFFF8FAFC),
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: _primary, width: 1.5),
          ),
        ),
      ),
    );
  }

  Widget _sheetSaveBtn(
      {String label = 'Save', required VoidCallback onPressed}) {
    return SizedBox(
      width: double.infinity,
      height: 50,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: _primary,
          elevation: 0,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(14)),
        ),
        onPressed: onPressed,
        child: Text(label,
            style: const TextStyle(
                color: Colors.white,
                fontSize: 15,
                fontWeight: FontWeight.w700)),
      ),
    );
  }

  // ── Media pickers ─────────────────────────────────────────────────────────────
  Future<void> _pickAndUploadProfilePicture(
      StudentProfileProvider pv) async {
    if (_pickingImage) return;
    _pickingImage = true;
    try {
      final picked = await ImagePicker()
          .pickImage(source: ImageSource.gallery, imageQuality: 80);
      if (picked == null) return;
      final bytes = await picked.readAsBytes();
      final ok = await pv.uploadProfilePicture(bytes.toList(), picked.name);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text(ok ? 'Profile picture updated!' : 'Upload failed.'),
          backgroundColor: ok ? _primary : _danger,
          behavior: SnackBarBehavior.floating,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ));
      }
    } finally {
      _pickingImage = false;
    }
  }

  Future<void> _pickAndUploadResume(StudentProfileProvider pv) async {
    if (_pickingImage) return;
    _pickingImage = true;
    try {
      final picked =
          await ImagePicker().pickImage(source: ImageSource.gallery);
      if (picked == null) return;
      final bytes = await picked.readAsBytes();
      final ok = await pv.uploadResume(bytes.toList(), picked.name);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text(ok ? 'Resume uploaded!' : 'Upload failed.'),
          backgroundColor: ok ? _primary : _danger,
          behavior: SnackBarBehavior.floating,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ));
      }
    } finally {
      _pickingImage = false;
    }
  }

  void _openUrl(String url) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Text(url.isNotEmpty ? url : 'No URL available'),
      backgroundColor: _primary,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
    ));
  }

  void _showMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => _SheetWrapper(
        title: 'More',
        child: Column(
          children: [
            _menuTile(Icons.notifications_outlined, 'Notifications', _primary,
                () => Navigator.pop(context)),
            _menuTile(Icons.help_outline_rounded, 'Help & Support',
                const Color(0xFF10B981), () => Navigator.pop(context)),
            _menuTile(Icons.info_outline_rounded, 'About', _textMid,
                () => Navigator.pop(context)),
          ],
        ),
      ),
    );
  }

  Widget _menuTile(
      IconData icon, String label, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Row(children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(width: 14),
          Text(label,
              style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: _textDark)),
          const Spacer(),
          const Icon(Icons.chevron_right_rounded,
              color: _textLight, size: 18),
        ]),
      ),
    );
  }
}

// ── Sheet wrapper ─────────────────────────────────────────────────────────────
class _SheetWrapper extends StatelessWidget {
  final String title;
  final Widget child;
  final bool scrollable;

  const _SheetWrapper({
    required this.title,
    required this.child,
    this.scrollable = false,
  });

  @override
  Widget build(BuildContext context) {
    final content = Padding(
      padding: EdgeInsets.fromLTRB(
          20, 0, 20, MediaQuery.viewInsetsOf(context).bottom + 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.only(top: 12, bottom: 20),
              decoration: BoxDecoration(
                color: const Color(0xFFE2E8F0),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          Text(title,
              style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF0F172A))),
          const SizedBox(height: 20),
          child,
        ],
      ),
    );

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: scrollable
          ? SingleChildScrollView(child: content)
          : content,
    );
  }
}

// ── Avatar placeholder ────────────────────────────────────────────────────────
class _AvatarPlaceholder extends StatelessWidget {
  const _AvatarPlaceholder();

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFFDDE8FF),
      child: const Icon(Icons.person_rounded,
          color: Color(0xFF3B82F6), size: 48),
    );
  }
}

// ── Required badge ────────────────────────────────────────────────────────────
class _RequiredBadge extends StatelessWidget {
  const _RequiredBadge();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: const Color(0xFFE0F2FE),
        borderRadius: BorderRadius.circular(20),
      ),
      child: const Text('Required',
          style: TextStyle(
              fontSize: 10,
              color: Color(0xFF0EA5E9),
              fontWeight: FontWeight.w700)),
    );
  }
}
