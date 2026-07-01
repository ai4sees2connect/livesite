class InternshipModel {
  final String id;
  final String title;
  final String company;
  final String location;
  final String workType;
  final String duration;
  final String stipend;
  final int stipendValue;
  final String stipendType;
  final String currency;
  final String logo;
  final int color;
  final List<String> tags;
  final List<String> skills;
  final List<String> perks;
  final String description;
  final int openings;
  final bool featured;
  final bool paid;

  // Extra details from the API not shown in the summary card.
  final String jobProfile;
  final String industry;
  final String status;
  final String ppoCheck;
  final String incentiveDescription;
  final String assessment;
  final int views;
  final int studentCount;
  final String createdAt;
  final String updatedAt;
  final Map<String, dynamic> recruiter;

  const InternshipModel({
    required this.id,
    required this.title,
    required this.company,
    required this.location,
    required this.workType,
    required this.duration,
    required this.stipend,
    required this.stipendValue,
    this.stipendType = '',
    this.currency = '₹',
    required this.logo,
    required this.color,
    required this.tags,
    required this.skills,
    required this.perks,
    required this.description,
    required this.openings,
    required this.featured,
    required this.paid,
    this.jobProfile = '',
    this.industry = '',
    this.status = '',
    this.ppoCheck = '',
    this.incentiveDescription = '',
    this.assessment = '',
    this.views = 0,
    this.studentCount = 0,
    this.createdAt = '',
    this.updatedAt = '',
    this.recruiter = const {},
  });

  factory InternshipModel.fromJson(Map<String, dynamic> json) {
    final stipendValue = (json['stipendValue'] ?? json['stipend'] ?? 0) is num
        ? (json['stipendValue'] ?? json['stipend'] ?? 0) as num
        : 0;
    final stipendType = json['stipendType']?.toString() ?? '';
    final paid = stipendType.isEmpty
        ? stipendValue > 0
        : stipendType.toLowerCase() != 'unpaid';
    final title = json['internshipName']?.toString() ??
        json['title']?.toString() ??
        '';
    final recruiter = json['recruiter'] is Map
        ? json['recruiter'] as Map<String, dynamic>
        : <String, dynamic>{};
    final company = json['company']?.toString() ??
        recruiter['companyName']?.toString() ??
        '';
    final internLocation = json['internLocation'] is Map
        ? json['internLocation'] as Map<String, dynamic>
        : <String, dynamic>{};
    final location = json['location']?.toString() ??
        [internLocation['city'], internLocation['state'], internLocation['country']]
            .where((e) => e != null && e.toString().trim().isNotEmpty)
            .join(', ');

    return InternshipModel(
      id: (json['id'] ?? json['_id'] ?? '').toString(),
      title: title,
      company: company,
      location: location.isNotEmpty
          ? location
          : (json['internshipType']?.toString() ?? ''),
      workType: json['internshipType']?.toString() ??
          json['workType']?.toString() ??
          'On-site',
      duration: json['duration']?.toString() ?? '',
      stipend: stipendValue > 0
          ? '${json['currency'] ?? '₹'}$stipendValue'
          : 'Unpaid',
      stipendValue: stipendValue.toInt(),
      stipendType: stipendType,
      currency: json['currency']?.toString() ?? '₹',
      logo: json['logo']?.toString() ??
          (company.isNotEmpty ? company.substring(0, 1).toUpperCase() : ''),
      color: json['color'] is int ? json['color'] as int : 0xFF3B82F6,
      tags: (json['tags'] as List?)?.map((e) => e.toString()).toList() ?? [],
      skills:
          (json['skills'] as List?)?.map((e) => e.toString()).toList() ?? [],
      perks: (json['perks'] as List?)?.map((e) => e.toString()).toList() ?? [],
      description: json['description']?.toString() ?? '',
      openings: (json['numberOfOpenings'] as num?)?.toInt() ??
          (json['openings'] as num?)?.toInt() ??
          0,
      featured: json['featured'] == true,
      paid: paid,
      jobProfile: json['jobProfile']?.toString() ?? '',
      industry: json['industry']?.toString() ?? '',
      status: json['status']?.toString() ?? '',
      ppoCheck: json['ppoCheck']?.toString() ?? '',
      incentiveDescription: json['incentiveDescription']?.toString() ?? '',
      assessment: json['assessment']?.toString() ?? '',
      views: (json['views'] as num?)?.toInt() ?? 0,
      studentCount: (json['studentCount'] as num?)?.toInt() ?? 0,
      createdAt: json['createdAt']?.toString() ?? '',
      updatedAt: json['updatedAt']?.toString() ?? '',
      recruiter: recruiter,
    );
  }
}
