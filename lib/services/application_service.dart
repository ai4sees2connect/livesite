import 'package:internship_app/models/application_model.dart';

class ApplicationService {
  static List<ApplicationModel> getMockApplications() {
    return const [
      ApplicationModel(
        id: '1',
        internshipId: '1',
        title: 'Flutter Developer Intern',
        company: 'TechCorp',
        logo: 'TC',
        appliedDate: 'Jun 20, 2026',
        status: 'Under Review',
        statusColor: 0xFFF59E0B,
      ),
      ApplicationModel(
        id: '2',
        internshipId: '2',
        title: 'UI/UX Design Intern',
        company: 'DesignHub',
        logo: 'DH',
        appliedDate: 'Jun 15, 2026',
        status: 'Shortlisted',
        statusColor: 0xFF10B981,
      ),
      ApplicationModel(
        id: '3',
        internshipId: '4',
        title: 'ML Intern',
        company: 'AI Labs',
        logo: 'AL',
        appliedDate: 'Jun 10, 2026',
        status: 'Interview Scheduled',
        statusColor: 0xFF3B82F6,
      ),
      ApplicationModel(
        id: '4',
        internshipId: '3',
        title: 'Backend Developer Intern',
        company: 'DataSoft',
        logo: 'DS',
        appliedDate: 'Jun 5, 2026',
        status: 'Rejected',
        statusColor: 0xFFEF4444,
      ),
    ];
  }
}
