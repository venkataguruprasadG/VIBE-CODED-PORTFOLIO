export type ViewId = 'overview' | 'work' | 'experience' | 'notes' | 'contact';

export type ProjectCategory = 'All' | 'AI & Vision' | 'IoT & Embedded';

export interface ArchNode {
  id: string;
  label: string;
  sublabel: string;
  x: number;
  y: number;
  kind: 'client' | 'gateway' | 'core' | 'store' | 'worker';
}

export interface ArchEdge {
  from: string;
  to: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<ProjectCategory, 'All'>;
  year: string;
  role: string;
  summary: string;
  primaryMetric: string;
  stack: string[];
  challenge: string;
  decisions: {
    title: string;
    detail: string;
  }[];
  outcomes: {
    metric: string;
    label: string;
  }[];
  architecture: {
    caption: string;
    nodes: ArchNode[];
    edges: ArchEdge[];
  };
}

export interface InternshipItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  summary: string;
  highlights: string[];
  stack: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
  score: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
}

export interface ToolkitGroup {
  category: string;
  description: string;
  items: string[];
}

export interface NoteSection {
  type: 'paragraph' | 'subheading' | 'code';
  content: string;
  language?: string;
  filename?: string;
}

export interface EngineeringNote {
  id: string;
  title: string;
  date: string;
  readingTime: string;
  topic: string;
  excerpt: string;
  sections: NoteSection[];
}

export const ENGINEER_PROFILE = {
  initials: 'VG',
  name: 'Venkata Guru Prasad Gummadi',
  shortName: 'Venkata Guru Prasad',
  title: 'Computer Science & IoT Engineer',
  headline: 'Building intelligent vision systems & reliable embedded software.',
  availability: 'Open to Software & AI/IoT Engineering Roles',
  location: 'Hyderabad, India',
  timezone: 'Asia/Kolkata',
  email: 'venkatagp27@gmail.com',
  phone: '+91 7032536516',
  profileImageUrl: '/assets/aistudio/MY_PROFILE_PIC_89f85d1d.jpeg',
  resumePdfUrl: '/assets/aistudio/CB.SC.P2CSE26006_b6d8210c.pdf',
  bio: '4th-year Computer Science Engineering student specializing in IoT at ACE Engineering College (CGPA 8.73), with strong foundations in Python, Java, Computer Vision, and Embedded C++. Certified Pearson MePro Level 10 Expert with NPTEL Java credentials and hands-on virtual internships in AI/ML.',
  configManifest: {
    engineer: 'Venkata Guru Prasad Gummadi',
    degree: 'B.Tech — CSO (IoT), 2022–2026',
    location: 'Hyderabad, India',
    cgpa: '8.73 / 10.0',
    core_stack: ['Python', 'Java', 'C#', 'MySQL', 'OpenCV', 'Arduino'],
    credentials: {
      english: 'Pearson MePro Level 10 Expert',
      java: 'NPTEL Programming in Java',
      internships: 'Edunet (AI) & EduSkills (AIML)',
    },
  },
  languagesSpoken: [
    { language: 'English', proficiency: 'Fluent' },
    { language: 'Telugu', proficiency: 'Native' },
    { language: 'Hindi', proficiency: 'Intermediate' },
  ],
  softSkills: [
    'Problem Solving & Critical Thinking',
    'Communication',
    'Leadership',
    'Team Collaboration',
    'Adaptability',
  ],
};

export const PROJECTS: Project[] = [
  {
    id: 'multi-face-recognition',
    title: 'Multi Face Recognition System',
    subtitle: 'Real-time multi-subject detection & identification pipeline',
    category: 'AI & Vision',
    year: '2025',
    role: 'Project Developer',
    summary:
      'Computer vision system that detects and recognizes multiple faces simultaneously in real time using OpenCV and TensorFlow, designed for automated attendance, security screening, and access control.',
    primaryMetric: 'Real-time multi-face detection · OpenCV + TensorFlow',
    stack: ['Python', 'OpenCV', 'TensorFlow', 'Jupyter Notebook'],
    challenge:
      'Single-face classifiers fail in crowded frames or varying classroom and entryway lighting, causing missed detections or high false-match rates across simultaneous subjects.',
    decisions: [
      {
        title: 'Decoupled Detection & Embedding Pipeline',
        detail:
          'Used OpenCV frame capture and face region localization to crop bounding boxes before passing normalized face tensors into a TensorFlow recognition model for parallel identity inference.',
      },
      {
        title: 'Confidence Thresholding for Unknown Subjects',
        detail:
          'Applied strict Euclidean distance and probability thresholds so unregistered individuals are flagged as Unknown rather than misclassified into existing attendance records.',
      },
      {
        title: 'Multi-Target Frame Overlay & Logging',
        detail:
          'Annotated every tracked bounding box independently within the live video stream, enabling simultaneous recognition across multiple individuals for access control and attendance logging.',
      },
    ],
    outcomes: [
      { metric: 'Multi-Face', label: 'Simultaneous identification within live frames' },
      { metric: 'Real-Time', label: 'Continuous OpenCV stream capture & annotation' },
      { metric: '3 Use Cases', label: 'Security, attendance & access control ready' },
    ],
    architecture: {
      caption: 'Live camera ingestion, OpenCV face ROI extraction, TensorFlow inference, and access logging',
      nodes: [
        { id: 'cam', label: 'Camera Feed', sublabel: 'OpenCV VideoCapture', x: 30, y: 110, kind: 'client' },
        { id: 'detect', label: 'Face Detector', sublabel: 'ROI Bounding Boxes', x: 205, y: 110, kind: 'gateway' },
        { id: 'tf', label: 'TensorFlow Model', sublabel: 'Feature Embeddings', x: 390, y: 55, kind: 'core' },
        { id: 'db', label: 'Identity Store', sublabel: 'Known Profiles', x: 390, y: 175, kind: 'store' },
        { id: 'log', label: 'Access / Tally', sublabel: 'Attendance & Alerts', x: 585, y: 110, kind: 'worker' },
      ],
      edges: [
        { from: 'cam', to: 'detect', label: 'Frames' },
        { from: 'detect', to: 'tf', label: 'Face ROIs' },
        { from: 'tf', to: 'db', label: 'Compare' },
        { from: 'tf', to: 'log', label: 'Matched ID' },
      ],
    },
  },
  {
    id: 'biometric-evm',
    title: 'Biometric Electronic Voting Machine',
    subtitle: 'Fingerprint-authenticated voting terminal with live tally display',
    category: 'IoT & Embedded',
    year: '2025',
    role: 'Hardware & Embedded Developer',
    summary:
      'Biometric-enabled Electronic Voting Machine built with Arduino and Embedded C++ that authenticates voters via fingerprint recognition, securely logs each ballot, and displays real-time winner analysis.',
    primaryMetric: 'Fingerprint authentication · Real-time candidate tally',
    stack: ['Arduino', 'Embedded C++', 'Fingerprint Sensor', 'Integrated Display'],
    challenge:
      'Conventional manual or button-only voting prototypes lack voter identity verification at the terminal level, creating risk of duplicate ballot submissions without hardware-level lockouts.',
    decisions: [
      {
        title: 'Hardware Biometric Pre-Authorization',
        detail:
          'Integrated a fingerprint sensor module over serial UART with the Arduino microcontroller so ballot push-buttons remain locked until a valid enrolled template is matched.',
      },
      {
        title: 'Single-Vote State Flagging',
        detail:
          'Tracked voter ID state in Embedded C++ immediately upon vote confirmation, preventing repeat votes from the same fingerprint during an active election cycle.',
      },
      {
        title: 'Integrated Real-Time Tally & Winner Display',
        detail:
          'Engineered live vote count accumulation with an automated result analysis routine that outputs total counts and declares the winning candidate on the integrated display.',
      },
    ],
    outcomes: [
      { metric: '1:1 Match', label: 'Fingerprint verification prior to ballot unlock' },
      { metric: 'Zero Dupes', label: 'Per-voter state lock after ballot capture' },
      { metric: 'Live Tally', label: 'Real-time vote count & winner display' },
    ],
    architecture: {
      caption: 'Fingerprint verification, Arduino Embedded C++ vote state machine, and integrated tally display',
      nodes: [
        { id: 'sensor', label: 'Biometric Sensor', sublabel: 'Fingerprint Scan', x: 30, y: 110, kind: 'client' },
        { id: 'mcu', label: 'Arduino MCU', sublabel: 'Embedded C++ Logic', x: 210, y: 110, kind: 'core' },
        { id: 'keypad', label: 'Candidate Input', sublabel: 'Unlocked on Match', x: 400, y: 55, kind: 'gateway' },
        { id: 'store', label: 'Vote Counter', sublabel: 'Secure Tally Log', x: 400, y: 175, kind: 'store' },
        { id: 'lcd', label: 'LCD Display', sublabel: 'Live Winner Analysis', x: 585, y: 110, kind: 'worker' },
      ],
      edges: [
        { from: 'sensor', to: 'mcu', label: 'UART ID' },
        { from: 'mcu', to: 'keypad', label: 'Unlock' },
        { from: 'keypad', to: 'store', label: 'Record' },
        { from: 'store', to: 'lcd', label: 'Output' },
      ],
    },
  },
];

export const INTERNSHIPS: InternshipItem[] = [
  {
    id: 'int-eduskills',
    role: 'AIML Virtual Intern',
    organization: 'EduSkills',
    location: 'Virtual / Remote',
    period: 'April 2025 — June 2025',
    summary:
      'Completed structured hands-on training and applied project modules across supervised learning, model evaluation, and neural network workflows.',
    highlights: [
      'Built and evaluated machine learning pipelines in Python and Jupyter Notebook for classification and pattern recognition tasks.',
      'Practiced data preprocessing, feature normalization, and validation workflows aligned with TensorFlow and OpenCV workflows.',
    ],
    stack: ['Python', 'AIML', 'TensorFlow', 'Jupyter Notebook'],
  },
  {
    id: 'int-edunet',
    role: 'Foundations of AI Intern',
    organization: 'Edunet Foundation',
    location: 'Virtual / Remote',
    period: '10 April 2025 — 10 May 2025',
    summary:
      'Intensive one-month foundational artificial intelligence internship covering core AI concepts, problem framing, and Python implementation.',
    highlights: [
      'Explored core AI search, reasoning, and introductory computer vision architectures.',
      'Applied Python programming fundamentals to structure clean, reproducible notebook experiments.',
    ],
    stack: ['Python', 'Foundations of AI', 'Jupyter Notebook'],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    id: 'edu-btech',
    institution: 'ACE Engineering College, Ghatkesar',
    degree: 'B.Tech — Computer Science & Engineering (IoT / CSO)',
    period: '2022 — 2026',
    score: 'CGPA: 8.73',
  },
  {
    id: 'edu-inter',
    institution: 'Sri Chaitanya Jr Kalasala, Kukatpally',
    degree: 'Intermediate — MPC',
    period: '2022',
    score: 'Percentage: 93.3%',
  },
  {
    id: 'edu-school',
    institution: 'Sri Chaitanya Techno School, IDPL, Medchal',
    degree: 'Secondary School Certificate (10th)',
    period: '2020',
    score: '100% (CGPA 10.0)',
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: 'cert-mepro',
    title: 'Pearson Mepro Level 10 Expert Certification',
    issuer: 'Pearson',
  },
  {
    id: 'cert-nptel-java',
    title: 'Programming in Java',
    issuer: 'NPTEL',
  },
  {
    id: 'cert-cisco-py1',
    title: 'Python Essentials 1',
    issuer: 'Cisco Networking Academy',
  },
  {
    id: 'cert-cisco-py2',
    title: 'Python Essentials 2',
    issuer: 'Cisco Networking Academy',
  },
  {
    id: 'cert-linkedin-java',
    title: 'Learning in Java',
    issuer: 'LinkedIn Learning',
  },
];

export const TOOLKIT_GROUPS: ToolkitGroup[] = [
  {
    category: 'Programming Languages',
    description: 'Core languages applied across coursework, projects, and databases.',
    items: ['Python', 'Java', 'C#', 'C / Embedded C++', 'MySQL', 'HTML & CSS', 'JavaScript (Beginner)'],
  },
  {
    category: 'Frameworks & Libraries',
    description: 'Application frameworks and computer vision / ML toolkits.',
    items: ['.NET Framework', 'Bootstrap 5', 'OpenCV', 'TensorFlow', 'Arduino SDK'],
  },
  {
    category: 'Core CS Concepts',
    description: 'Theoretical and engineering foundations from B.Tech CSO curriculum.',
    items: [
      'Data Structures & Algorithms',
      'Database Management Systems',
      'Computer Networks',
      'Front End Web Development',
      'IoT & Embedded Systems',
    ],
  },
  {
    category: 'Tools & IDEs',
    description: 'Development, analytics, and experimentation environments.',
    items: ['Visual Studio Code', 'Visual Studio', 'Jupyter Notebook', 'Power BI', 'Microsoft Excel'],
  },
];

export const ENGINEERING_NOTES: EngineeringNote[] = [
  {
    id: 'opencv-tensorflow-multiface',
    title: 'Structuring Real-Time Multi-Face Recognition with OpenCV & TensorFlow',
    date: 'July 18, 2025',
    readingTime: '4 min read',
    topic: 'AI & Computer Vision',
    excerpt:
      'Lessons from separating fast bounding-box detection from TensorFlow embedding inference to keep multi-person video feeds responsive.',
    sections: [
      {
        type: 'paragraph',
        content:
          'When building a real-time Multi Face Recognition System for attendance and access control, running heavy neural inference across an entire high-resolution video frame quickly bottlenecks frame rates. Separating spatial face detection from embedding classification keeps the pipeline fluid even when several people enter the frame together.',
      },
      {
        type: 'subheading',
        content: '1. Detect First, Normalize Each ROI',
      },
      {
        type: 'paragraph',
        content:
          'OpenCV captures incoming webcam frames and locates every face region first. Each detected region of interest (ROI) is cropped, resized to the input dimensions expected by TensorFlow, and normalized before batching inference.',
      },
      {
        type: 'code',
        language: 'python',
        filename: 'face_pipeline.py',
        content: `import cv2
import numpy as np

def extract_face_batch(frame, boxes, target_size=(160, 160)):
    crops = []
    for (x, y, w, h) in boxes:
        roi = frame[y:y+h, x:x+w]
        resized = cv2.resize(roi, target_size)
        normalized = (resized.astype("float32") / 127.5) - 1.0
        crops.append(normalized)
    return np.array(crops)`,
      },
      {
        type: 'subheading',
        content: '2. Guarding Against Unknown Faces',
      },
      {
        type: 'paragraph',
        content:
          'In attendance or security systems, predicting the closest enrolled class unconditionally creates false positives. Adding an explicit confidence cutoff ensures unrecognized visitors stay labeled as Unknown instead of triggering unauthorized access.',
      },
    ],
  },
  {
    id: 'arduino-biometric-evm',
    title: 'Biometric Verification & Duplicate-Vote Prevention on Arduino',
    date: 'May 22, 2025',
    readingTime: '4 min read',
    topic: 'IoT & Embedded C++',
    excerpt:
      'How a deterministic Embedded C++ state machine pairs UART fingerprint verification with per-voter flags and real-time winner calculation.',
    sections: [
      {
        type: 'paragraph',
        content:
          'Designing a Biometric Electronic Voting Machine on Arduino requires strict control over hardware state transitions: candidate selection buttons must stay completely ignored until a registered fingerprint is authenticated and checked against prior votes.',
      },
      {
        type: 'subheading',
        content: 'Enforcing Single-Vote Invariants in Embedded C++',
      },
      {
        type: 'paragraph',
        content:
          'Once the fingerprint module returns a matched template ID over serial UART, the microcontroller checks a boolean `hasVoted[voterId]` table. Only unvoted IDs transition the terminal into `STATE_AWAITING_BALLOT`, after which a single button press increments the candidate tally and immediately locks that ID.',
      },
      {
        type: 'code',
        language: 'cpp',
        filename: 'evm_state_machine.ino',
        content: `bool hasVoted[MAX_VOTERS] = {false};
int candidateVotes[NUM_CANDIDATES] = {0};

void handleMatchedVoter(int voterId) {
  if (voterId < 0 || voterId >= MAX_VOTERS || hasVoted[voterId]) {
    displayMessage("Access Denied", "Already Voted");
    return;
  }
  int choice = waitForCandidatePress();
  if (choice >= 0 && choice < NUM_CANDIDATES) {
    candidateVotes[choice]++;
    hasVoted[voterId] = true;
    displayMessage("Vote Recorded", "Thank You");
  }
}`,
      },
      {
        type: 'paragraph',
        content:
          'At election close, an authenticated admin trigger scans `candidateVotes[]` to render live totals and highlight the winning candidate directly on the integrated display.',
      },
    ],
  },
  {
    id: 'java-mysql-foundations',
    title: 'Connecting Data Structures, Java & MySQL for Clean Applications',
    date: 'March 14, 2025',
    readingTime: '3 min read',
    topic: 'Software Foundations',
    excerpt:
      'Notes from NPTEL Programming in Java and DBMS coursework on choosing clean collections, parameterized SQL queries, and predictable error handling.',
    sections: [
      {
        type: 'paragraph',
        content:
          'Strong application code relies on pairing the right in-memory data structures in Java with normalized relational schemas in MySQL. Whether modeling student attendance logs or sensor readings, keeping query contracts explicit prevents subtle data corruption.',
      },
      {
        type: 'subheading',
        content: 'Parameterized Queries & Resource Safety',
      },
      {
        type: 'paragraph',
        content:
          'Using try-with-resources around JDBC `PreparedStatement` objects guarantees database connections close cleanly even when exceptions occur, while protecting queries from SQL injection.',
      },
      {
        type: 'code',
        language: 'java',
        filename: 'AttendanceDao.java',
        content: `String sql = "INSERT INTO attendance_logs (student_id, verified_at) VALUES (?, NOW())";
try (Connection conn = dataSource.getConnection();
     PreparedStatement stmt = conn.prepareStatement(sql)) {
    stmt.setString(1, studentId);
    stmt.executeUpdate();
}`,
      },
    ],
  },
];
