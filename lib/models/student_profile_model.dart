class EducationModel {
  final String degree;
  final String field;
  final String institute;
  final String year;
  final String score;

  EducationModel({
    required this.degree,
    required this.field,
    required this.institute,
    required this.year,
    required this.score,
  });

  factory EducationModel.fromJson(Map<String, dynamic> j) => EducationModel(
        degree: j['degree'] ?? j['course'] ?? '',
        field: j['field'] ?? j['specialization'] ?? '',
        institute: j['institute'] ?? j['school'] ?? '',
        year: '${j['startYear'] ?? ''} - ${j['endYear'] ?? ''}',
        score: j['score'] ?? j['cgpa'] ?? '',
      );
}

class WorkExperienceModel {
  final String role;
  final String company;
  final String type;
  final String duration;
  final String description;

  WorkExperienceModel({
    required this.role,
    required this.company,
    required this.type,
    required this.duration,
    required this.description,
  });

  factory WorkExperienceModel.fromJson(Map<String, dynamic> j) =>
      WorkExperienceModel(
        role: j['role'] ?? j['title'] ?? '',
        company: j['company'] ?? j['organization'] ?? '',
        type: j['type'] ?? '',
        duration: '${j['startDate'] ?? ''} - ${j['endDate'] ?? ''}',
        description: j['description'] ?? j['desc'] ?? '',
      );
}

class CertificateModel {
  final String name;
  final String issuer;
  final String date;

  CertificateModel({
    required this.name,
    required this.issuer,
    required this.date,
  });

  factory CertificateModel.fromJson(Map<String, dynamic> j) => CertificateModel(
        name: j['name'] ?? j['title'] ?? '',
        issuer: j['issuer'] ?? j['organization'] ?? '',
        date: j['date'] ?? j['issueDate'] ?? '',
      );
}

class ProjectModel {
  final String title;
  final String description;
  final String link;

  ProjectModel({
    required this.title,
    required this.description,
    required this.link,
  });

  factory ProjectModel.fromJson(Map<String, dynamic> j) => ProjectModel(
        title: j['title'] ?? j['name'] ?? '',
        description: j['description'] ?? '',
        link: j['link'] ?? j['url'] ?? '',
      );
}

class SkillModel {
  final String name;
  final String level;

  SkillModel({required this.name, required this.level});

  factory SkillModel.fromJson(Map<String, dynamic> j) => SkillModel(
        name: j['skill'] ?? j['name'] ?? '',
        level: j['level'] ?? j['proficiency'] ?? 'Beginner',
      );
}

class PortfolioLinkModel {
  final String label;
  final String url;

  PortfolioLinkModel({required this.label, required this.url});

  factory PortfolioLinkModel.fromJson(Map<String, dynamic> j) =>
      PortfolioLinkModel(
        label: j['label'] ?? j['title'] ?? j['platform'] ?? '',
        url: j['url'] ?? j['link'] ?? '',
      );
}

class ResumeModel {
  final String fileName;
  final String uploadedAt;
  final String url;

  ResumeModel({
    required this.fileName,
    required this.uploadedAt,
    required this.url,
  });

  factory ResumeModel.fromJson(Map<String, dynamic> j) => ResumeModel(
        fileName: j['fileName'] ?? j['name'] ?? '',
        uploadedAt: j['uploadedAt'] ?? j['date'] ?? '',
        url: j['url'] ?? j['resumeUrl'] ?? '',
      );
}
