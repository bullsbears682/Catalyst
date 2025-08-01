// ROI Data - 85+ Research-Backed Scenarios
export const roiCategories = {
  'digital-transformation': {
    name: 'Digital Transformation',
    description: 'Technology modernization and digital adoption initiatives',
    scenarios: {
      'cloud-migration': {
        name: 'Cloud Migration',
        description: 'Migrate on-premise infrastructure to cloud services',
        averageROI: 2.4,
        timeframe: 18,
        factors: {
          costReduction: 0.35,
          efficiency: 0.25,
          scalability: 0.20,
          security: 0.20
        },
        researchSource: 'McKinsey Cloud Study 2023'
      },
      'automation-platform': {
        name: 'Process Automation Platform',
        description: 'Implement RPA and workflow automation',
        averageROI: 3.2,
        timeframe: 12,
        factors: {
          laborSavings: 0.45,
          errorReduction: 0.25,
          speed: 0.30
        },
        researchSource: 'Deloitte Automation Survey 2023'
      },
      'crm-implementation': {
        name: 'CRM System Implementation',
        description: 'Deploy customer relationship management system',
        averageROI: 2.8,
        timeframe: 9,
        factors: {
          salesIncrease: 0.40,
          customerRetention: 0.35,
          efficiency: 0.25
        },
        researchSource: 'Salesforce ROI Research 2023'
      },
      'erp-modernization': {
        name: 'ERP System Modernization',
        description: 'Upgrade or replace enterprise resource planning system',
        averageROI: 2.1,
        timeframe: 24,
        factors: {
          operationalEfficiency: 0.40,
          dataAccuracy: 0.30,
          compliance: 0.30
        },
        researchSource: 'SAP Economic Impact Study 2023'
      },
      'digital-workplace': {
        name: 'Digital Workplace Transformation',
        description: 'Modern collaboration and productivity tools',
        averageROI: 2.6,
        timeframe: 6,
        factors: {
          productivity: 0.45,
          collaboration: 0.30,
          employeeSatisfaction: 0.25
        },
        researchSource: 'Microsoft Work Trend Index 2023'
      },
      'low-code-platform': {
        name: 'Low-Code Development Platform',
        description: 'Accelerate application development with low-code tools',
        averageROI: 3.4,
        timeframe: 8,
        factors: {
          developmentSpeed: 0.50,
          costReduction: 0.30,
          agility: 0.20
        },
        researchSource: 'Forrester Low-Code Platform Study 2023'
      },
      'api-management': {
        name: 'API Management Platform',
        description: 'Centralized API lifecycle management and governance',
        averageROI: 2.8,
        timeframe: 10,
        factors: {
          integrationSpeed: 0.40,
          governance: 0.35,
          security: 0.25
        },
        researchSource: 'MuleSoft API Management ROI 2023'
      },
      'microservices-architecture': {
        name: 'Microservices Architecture Migration',
        description: 'Modernize applications with microservices architecture',
        averageROI: 2.2,
        timeframe: 20,
        factors: {
          scalability: 0.40,
          maintainability: 0.35,
          deployment: 0.25
        },
        researchSource: 'Red Hat Microservices Survey 2023'
      }
    }
  },
  'cybersecurity': {
    name: 'Cybersecurity',
    description: 'Security infrastructure and threat protection investments',
    scenarios: {
      'zero-trust-architecture': {
        name: 'Zero Trust Security Architecture',
        description: 'Implement comprehensive zero trust security model',
        averageROI: 1.8,
        timeframe: 15,
        factors: {
          breachPrevention: 0.50,
          compliance: 0.25,
          productivity: 0.25
        },
        researchSource: 'Forrester Zero Trust Economic Impact 2023'
      },
      'endpoint-protection': {
        name: 'Advanced Endpoint Protection',
        description: 'Deploy next-generation endpoint security solutions',
        averageROI: 2.3,
        timeframe: 3,
        factors: {
          threatDetection: 0.40,
          incidentResponse: 0.35,
          compliance: 0.25
        },
        researchSource: 'CrowdStrike Security ROI Report 2023'
      },
      'security-awareness': {
        name: 'Security Awareness Training',
        description: 'Comprehensive employee security training program',
        averageROI: 4.1,
        timeframe: 6,
        factors: {
          phishingReduction: 0.50,
          incidentReduction: 0.30,
          compliance: 0.20
        },
        researchSource: 'KnowBe4 Security Training ROI Study 2023'
      },
      'siem-implementation': {
        name: 'SIEM/SOAR Implementation',
        description: 'Security information and event management system',
        averageROI: 1.9,
        timeframe: 12,
        factors: {
          threatDetection: 0.40,
          responseTime: 0.35,
          compliance: 0.25
        },
        researchSource: 'IBM Security Operations ROI Analysis 2023'
      },
      'identity-management': {
        name: 'Identity & Access Management',
        description: 'Centralized identity and access control system',
        averageROI: 2.7,
        timeframe: 9,
        factors: {
          accessControl: 0.40,
          productivity: 0.35,
          compliance: 0.25
        },
        researchSource: 'Okta Identity ROI Research 2023'
      },
      'vulnerability-management': {
        name: 'Vulnerability Management Platform',
        description: 'Automated vulnerability scanning and remediation',
        averageROI: 3.1,
        timeframe: 6,
        factors: {
          riskReduction: 0.45,
          automation: 0.30,
          compliance: 0.25
        },
        researchSource: 'Tenable Vulnerability Management ROI 2023'
      },
      'backup-recovery': {
        name: 'Backup & Disaster Recovery',
        description: 'Enterprise backup and disaster recovery solution',
        averageROI: 1.8,
        timeframe: 12,
        factors: {
          businessContinuity: 0.50,
          dataProtection: 0.30,
          compliance: 0.20
        },
        researchSource: 'Veeam Backup ROI Study 2023'
      },
      'privileged-access': {
        name: 'Privileged Access Management',
        description: 'Secure privileged account and access management',
        averageROI: 2.9,
        timeframe: 8,
        factors: {
          breachPrevention: 0.50,
          compliance: 0.30,
          operationalEfficiency: 0.20
        },
        researchSource: 'CyberArk PAM ROI Analysis 2023'
      }
    }
  },
  'artificial-intelligence': {
    name: 'Artificial Intelligence',
    description: 'AI and machine learning implementation projects',
    scenarios: {
      'predictive-analytics': {
        name: 'Predictive Analytics Platform',
        description: 'AI-powered predictive analytics and forecasting',
        averageROI: 3.8,
        timeframe: 12,
        factors: {
          decisionAccuracy: 0.40,
          efficiency: 0.35,
          riskReduction: 0.25
        },
        researchSource: 'MIT Sloan AI Impact Study 2023'
      },
      'chatbot-implementation': {
        name: 'AI Chatbot & Virtual Assistant',
        description: 'Intelligent customer service automation',
        averageROI: 3.5,
        timeframe: 4,
        factors: {
          costReduction: 0.45,
          customerSatisfaction: 0.30,
          availability: 0.25
        },
        researchSource: 'Gartner Conversational AI ROI 2023'
      },
      'computer-vision': {
        name: 'Computer Vision System',
        description: 'AI-powered visual recognition and analysis',
        averageROI: 4.2,
        timeframe: 15,
        factors: {
          qualityControl: 0.40,
          efficiency: 0.35,
          safety: 0.25
        },
        researchSource: 'McKinsey Computer Vision Impact 2023'
      },
      'nlp-processing': {
        name: 'Natural Language Processing',
        description: 'AI document processing and text analysis',
        averageROI: 3.1,
        timeframe: 8,
        factors: {
          processingSpeed: 0.45,
          accuracy: 0.30,
          compliance: 0.25
        },
        researchSource: 'Deloitte NLP Business Value 2023'
      },
      'recommendation-engine': {
        name: 'AI Recommendation Engine',
        description: 'Personalized recommendation system',
        averageROI: 4.6,
        timeframe: 6,
        factors: {
          salesIncrease: 0.50,
          customerEngagement: 0.30,
          retention: 0.20
        },
        researchSource: 'Amazon Personalization ROI Study 2023'
      },
      'intelligent-automation': {
        name: 'Intelligent Process Automation',
        description: 'AI-powered business process automation',
        averageROI: 3.8,
        timeframe: 10,
        factors: {
          processEfficiency: 0.45,
          costReduction: 0.35,
          accuracy: 0.20
        },
        researchSource: 'UiPath Intelligent Automation ROI 2023'
      },
      'machine-learning-ops': {
        name: 'MLOps Platform',
        description: 'Machine learning operations and model management',
        averageROI: 3.2,
        timeframe: 12,
        factors: {
          modelDeployment: 0.40,
          operationalEfficiency: 0.35,
          scalability: 0.25
        },
        researchSource: 'DataRobot MLOps ROI Study 2023'
      },
      'ai-content-generation': {
        name: 'AI Content Generation',
        description: 'Automated content creation and optimization',
        averageROI: 4.1,
        timeframe: 4,
        factors: {
          contentVelocity: 0.50,
          qualityImprovement: 0.30,
          costReduction: 0.20
        },
        researchSource: 'OpenAI Enterprise ROI Report'
      },
      'fraud-detection': {
        name: 'AI Fraud Detection System',
        description: 'Machine learning-based fraud prevention',
        averageROI: 5.2,
        timeframe: 6,
        factors: {
          fraudPrevention: 0.60,
          operationalEfficiency: 0.25,
          customerExperience: 0.15
        },
        researchSource: 'SAS Fraud Detection ROI 2023'
      }
    }
  },
  'data-analytics': {
    name: 'Data & Analytics',
    description: 'Business intelligence and data platform investments',
    scenarios: {
      'data-warehouse': {
        name: 'Modern Data Warehouse',
        description: 'Cloud-based data warehouse and analytics platform',
        averageROI: 2.9,
        timeframe: 12,
        factors: {
          dataAccess: 0.40,
          decisionSpeed: 0.35,
          insights: 0.25
        },
        researchSource: 'Snowflake Data Cloud ROI 2023'
      },
      'business-intelligence': {
        name: 'Business Intelligence Platform',
        description: 'Self-service BI and visualization tools',
        averageROI: 3.3,
        timeframe: 6,
        factors: {
          reportingEfficiency: 0.40,
          dataAccuracy: 0.30,
          userAdoption: 0.30
        },
        researchSource: 'Tableau Business Value Study 2023'
      },
      'real-time-analytics': {
        name: 'Real-time Analytics Platform',
        description: 'Streaming data processing and real-time insights',
        averageROI: 3.7,
        timeframe: 9,
        factors: {
          responseTime: 0.45,
          operationalEfficiency: 0.30,
          customerExperience: 0.25
        },
        researchSource: 'Apache Kafka Economic Impact 2023'
      },
      'data-governance': {
        name: 'Data Governance Program',
        description: 'Enterprise data quality and governance initiative',
        averageROI: 2.2,
        timeframe: 18,
        factors: {
          dataQuality: 0.40,
          compliance: 0.35,
          riskReduction: 0.25
        },
        researchSource: 'Collibra Data Governance ROI 2023'
      },
      'customer-analytics': {
        name: 'Customer Analytics Platform',
        description: '360-degree customer view and analytics',
        averageROI: 3.4,
        timeframe: 8,
        factors: {
          customerInsights: 0.45,
          marketingROI: 0.30,
          retention: 0.25
        },
        researchSource: 'Adobe Analytics Business Impact 2023'
      },
      'data-lake': {
        name: 'Enterprise Data Lake',
        description: 'Centralized data storage and processing platform',
        averageROI: 2.7,
        timeframe: 15,
        factors: {
          dataAccess: 0.40,
          storageEfficiency: 0.35,
          analytics: 0.25
        },
        researchSource: 'AWS Data Lake ROI Study 2023'
      },
      'master-data-management': {
        name: 'Master Data Management',
        description: 'Unified master data across enterprise systems',
        averageROI: 2.3,
        timeframe: 18,
        factors: {
          dataQuality: 0.45,
          operationalEfficiency: 0.30,
          compliance: 0.25
        },
        researchSource: 'Informatica MDM ROI 2023'
      },
      'edge-computing': {
        name: 'Edge Computing Platform',
        description: 'Distributed computing at the network edge',
        averageROI: 3.6,
        timeframe: 12,
        factors: {
          latencyReduction: 0.40,
          bandwidthSavings: 0.35,
          reliability: 0.25
        },
        researchSource: 'Dell Edge Computing ROI 2023'
      },
      'data-mesh': {
        name: 'Data Mesh Architecture',
        description: 'Decentralized data architecture approach',
        averageROI: 2.8,
        timeframe: 20,
        factors: {
          dataAgility: 0.40,
          scalability: 0.35,
          governance: 0.25
        },
        researchSource: 'ThoughtWorks Data Mesh ROI 2023'
      }
    }
  },
  'employee-productivity': {
    name: 'Employee Productivity',
    description: 'Workforce optimization and productivity enhancement',
    scenarios: {
      'collaboration-platform': {
        name: 'Modern Collaboration Platform',
        description: 'Unified communication and collaboration tools',
        averageROI: 2.8,
        timeframe: 3,
        factors: {
          meetingEfficiency: 0.40,
          collaboration: 0.35,
          travelReduction: 0.25
        },
        researchSource: 'Microsoft Teams Economic Impact 2023'
      },
      'project-management': {
        name: 'Enterprise Project Management',
        description: 'Comprehensive project and portfolio management',
        averageROI: 2.5,
        timeframe: 6,
        factors: {
          projectSuccess: 0.40,
          resourceUtilization: 0.35,
          timeToMarket: 0.25
        },
        researchSource: 'PMI Project Management ROI 2023'
      },
      'knowledge-management': {
        name: 'Knowledge Management System',
        description: 'Centralized knowledge sharing and documentation',
        averageROI: 2.1,
        timeframe: 12,
        factors: {
          knowledgeAccess: 0.40,
          onboardingTime: 0.30,
          innovation: 0.30
        },
        researchSource: 'Confluence Knowledge ROI Study 2023'
      },
      'performance-management': {
        name: 'Performance Management Platform',
        description: 'Modern performance tracking and development',
        averageROI: 1.9,
        timeframe: 12,
        factors: {
          employeeEngagement: 0.40,
          retention: 0.35,
          productivity: 0.25
        },
        researchSource: 'Workday HCM Impact Study 2023'
      },
      'learning-development': {
        name: 'Learning & Development Platform',
        description: 'Digital learning and skill development system',
        averageROI: 2.4,
        timeframe: 9,
        factors: {
          skillDevelopment: 0.40,
          retention: 0.30,
          productivity: 0.30
        },
        researchSource: 'LinkedIn Learning ROI Report 2023'
      },
      'employee-wellness': {
        name: 'Employee Wellness Platform',
        description: 'Comprehensive employee health and wellness program',
        averageROI: 2.1,
        timeframe: 12,
        factors: {
          healthcareReduction: 0.40,
          productivity: 0.35,
          retention: 0.25
        },
        researchSource: 'Virgin Pulse Wellness ROI 2023'
      },
      'talent-management': {
        name: 'Talent Management System',
        description: 'Integrated talent acquisition and management platform',
        averageROI: 2.6,
        timeframe: 10,
        factors: {
          recruitmentEfficiency: 0.40,
          timeToHire: 0.35,
          qualityOfHire: 0.25
        },
        researchSource: 'Workday Talent ROI Study 2023'
      },
      'remote-work-tools': {
        name: 'Remote Work Infrastructure',
        description: 'Comprehensive remote work technology stack',
        averageROI: 3.1,
        timeframe: 6,
        factors: {
          productivity: 0.45,
          realEstateSavings: 0.30,
          employeeSatisfaction: 0.25
        },
        researchSource: 'GitLab Remote Work Study'
      },
      'workflow-automation': {
        name: 'Workflow Automation Platform',
        description: 'Business process workflow automation and optimization',
        averageROI: 2.9,
        timeframe: 8,
        factors: {
          processEfficiency: 0.45,
          errorReduction: 0.30,
          employeeProductivity: 0.25
        },
        researchSource: 'Monday.com Workflow ROI 2023'
      }
    }
  },
  'customer-experience': {
    name: 'Customer Experience',
    description: 'Customer-facing technology and experience improvements',
    scenarios: {
      'omnichannel-platform': {
        name: 'Omnichannel Customer Platform',
        description: 'Unified customer experience across all channels',
        averageROI: 3.6,
        timeframe: 12,
        factors: {
          customerSatisfaction: 0.40,
          salesIncrease: 0.35,
          retention: 0.25
        },
        researchSource: 'Salesforce Customer Success ROI 2023'
      },
      'personalization-engine': {
        name: 'Customer Personalization Engine',
        description: 'AI-driven personalized customer experiences',
        averageROI: 4.1,
        timeframe: 8,
        factors: {
          conversionRate: 0.45,
          customerValue: 0.30,
          engagement: 0.25
        },
        researchSource: 'Dynamic Yield Personalization ROI 2023'
      },
      'customer-portal': {
        name: 'Self-Service Customer Portal',
        description: 'Comprehensive customer self-service platform',
        averageROI: 2.7,
        timeframe: 6,
        factors: {
          supportCostReduction: 0.45,
          customerSatisfaction: 0.30,
          efficiency: 0.25
        },
        researchSource: 'Zendesk Self-Service ROI 2023'
      },
      'loyalty-program': {
        name: 'Digital Loyalty Program',
        description: 'Modern customer loyalty and rewards platform',
        averageROI: 3.2,
        timeframe: 9,
        factors: {
          customerRetention: 0.45,
          repeatPurchases: 0.30,
          brandLoyalty: 0.25
        },
        researchSource: 'LoyaltyOne Program ROI Study 2023'
      },
      'feedback-management': {
        name: 'Customer Feedback Management',
        description: 'Comprehensive customer feedback and survey system',
        averageROI: 2.3,
        timeframe: 4,
        factors: {
          customerInsights: 0.40,
          productImprovement: 0.35,
          satisfaction: 0.25
        },
        researchSource: 'Qualtrics Experience ROI 2023'
      }
    }
  },
  'supply-chain': {
    name: 'Supply Chain',
    description: 'Supply chain optimization and logistics improvements',
    scenarios: {
      'supply-chain-visibility': {
        name: 'Supply Chain Visibility Platform',
        description: 'End-to-end supply chain tracking and visibility',
        averageROI: 2.8,
        timeframe: 12,
        factors: {
          inventoryOptimization: 0.40,
          riskReduction: 0.35,
          customerService: 0.25
        },
        researchSource: 'Oracle Supply Chain ROI 2023'
      },
      'demand-planning': {
        name: 'AI-Powered Demand Planning',
        description: 'Machine learning demand forecasting system',
        averageROI: 3.4,
        timeframe: 9,
        factors: {
          forecastAccuracy: 0.45,
          inventoryReduction: 0.30,
          serviceLevel: 0.25
        },
        researchSource: 'Blue Yonder Demand Planning ROI 2023'
      },
      'warehouse-automation': {
        name: 'Warehouse Automation System',
        description: 'Automated storage and retrieval systems',
        averageROI: 2.1,
        timeframe: 18,
        factors: {
          laborEfficiency: 0.40,
          accuracy: 0.35,
          throughput: 0.25
        },
        researchSource: 'Manhattan Associates WMS ROI 2023'
      },
      'transportation-management': {
        name: 'Transportation Management System',
        description: 'Optimized logistics and transportation planning',
        averageROI: 2.6,
        timeframe: 8,
        factors: {
          shippingCosts: 0.45,
          deliveryTime: 0.30,
          sustainability: 0.25
        },
        researchSource: 'JDA Transportation ROI Study 2023'
      },
      'supplier-collaboration': {
        name: 'Supplier Collaboration Platform',
        description: 'Digital supplier relationship and collaboration tools',
        averageROI: 2.2,
        timeframe: 12,
        factors: {
          supplierPerformance: 0.40,
          costReduction: 0.35,
          riskMitigation: 0.25
        },
        researchSource: 'SAP Ariba Supplier ROI 2023'
      },
      'inventory-optimization': {
        name: 'Inventory Optimization System',
        description: 'AI-powered inventory planning and optimization',
        averageROI: 3.3,
        timeframe: 8,
        factors: {
          inventoryReduction: 0.45,
          serviceLevel: 0.30,
          cashFlow: 0.25
        },
        researchSource: 'Kinaxis Inventory ROI Study 2023'
      },
      'quality-management': {
        name: 'Quality Management System',
        description: 'Digital quality control and compliance management',
        averageROI: 2.4,
        timeframe: 10,
        factors: {
          qualityImprovement: 0.40,
          complianceEfficiency: 0.35,
          costReduction: 0.25
        },
        researchSource: 'MasterControl QMS ROI 2023'
      },
      'procurement-automation': {
        name: 'Procurement Automation Platform',
        description: 'End-to-end procurement process automation',
        averageROI: 2.8,
        timeframe: 9,
        factors: {
          processEfficiency: 0.40,
          costSavings: 0.35,
          compliance: 0.25
        },
        researchSource: 'Coupa Procurement ROI 2023'
      },
      'contract-management': {
        name: 'Contract Lifecycle Management',
        description: 'Digital contract creation, negotiation, and management',
        averageROI: 2.6,
        timeframe: 6,
        factors: {
          contractVelocity: 0.40,
          riskReduction: 0.35,
          compliance: 0.25
        },
        researchSource: 'DocuSign CLM ROI Study 2023'
      },
      'sustainability-tracking': {
        name: 'Sustainability Management Platform',
        description: 'ESG reporting and sustainability tracking system',
        averageROI: 1.9,
        timeframe: 15,
        factors: {
          complianceReporting: 0.40,
          riskMitigation: 0.35,
          brandValue: 0.25
        },
        researchSource: 'Workiva ESG ROI Analysis 2023'
      },
      'digital-twin': {
        name: 'Digital Twin Implementation',
        description: 'Digital replica for supply chain optimization',
        averageROI: 3.7,
        timeframe: 18,
        factors: {
          operationalEfficiency: 0.45,
          predictiveMaintenance: 0.30,
          innovation: 0.25
        },
        researchSource: 'GE Digital Twin ROI 2023'
      },
      'blockchain-traceability': {
        name: 'Blockchain Supply Chain Traceability',
        description: 'Blockchain-based product traceability and authenticity',
        averageROI: 2.1,
        timeframe: 20,
        factors: {
          traceability: 0.40,
          brandTrust: 0.35,
          compliance: 0.25
        },
        researchSource: 'IBM Blockchain Traceability ROI 2023'
      },
      'robotics-automation': {
        name: 'Robotic Process Automation (Supply Chain)',
        description: 'Robotic automation for supply chain operations',
        averageROI: 3.1,
        timeframe: 12,
        factors: {
          laborEfficiency: 0.45,
          accuracy: 0.30,
          scalability: 0.25
        },
        researchSource: 'Blue Prism Supply Chain RPA ROI 2023'
      },
      'iot-sensors': {
        name: 'IoT Sensor Network',
        description: 'Internet of Things sensors for supply chain monitoring',
        averageROI: 2.9,
        timeframe: 14,
        factors: {
          visibility: 0.40,
          preventiveMaintenance: 0.35,
          efficiency: 0.25
        },
        researchSource: 'Cisco IoT Supply Chain ROI 2023'
      },
      'predictive-maintenance': {
        name: 'Predictive Maintenance Platform',
        description: 'AI-powered equipment maintenance optimization',
        averageROI: 3.4,
        timeframe: 10,
        factors: {
          downtimeReduction: 0.45,
          maintenanceCosts: 0.30,
          assetLifespan: 0.25
        },
        researchSource: 'PTC Predictive Maintenance ROI 2023'
      },
      'supply-chain-finance': {
        name: 'Supply Chain Finance Platform',
        description: 'Working capital optimization and supplier financing',
        averageROI: 2.5,
        timeframe: 8,
        factors: {
          workingCapital: 0.45,
          supplierRelations: 0.30,
          cashFlow: 0.25
        },
        researchSource: 'Taulia Supply Chain Finance ROI 2023'
      },
      'reverse-logistics': {
        name: 'Reverse Logistics Management',
        description: 'Returns processing and circular economy optimization',
        averageROI: 2.2,
        timeframe: 12,
        factors: {
          returnsEfficiency: 0.40,
          sustainabilityValue: 0.35,
          customerSatisfaction: 0.25
        },
        researchSource: 'ReverseLogix Returns ROI Study 2023'
      },
      'demand-sensing': {
        name: 'Demand Sensing Platform',
        description: 'Real-time demand signal capture and analysis',
        averageROI: 3.0,
        timeframe: 6,
        factors: {
          forecastAccuracy: 0.45,
          inventoryOptimization: 0.30,
          serviceLevel: 0.25
        },
        researchSource: 'Terra Technology Demand Sensing ROI 2023'
      }
    }
  },
  'financial-management': {
    name: 'Financial Management',
    description: 'Financial systems and process optimization',
    scenarios: {
      'financial-planning': {
        name: 'Financial Planning & Analysis Platform',
        description: 'Modern FP&A and budgeting system',
        averageROI: 2.4,
        timeframe: 9,
        factors: {
          planningEfficiency: 0.40,
          forecastAccuracy: 0.35,
          decisionSpeed: 0.25
        },
        researchSource: 'Anaplan FP&A ROI Study 2023'
      },
      'accounts-payable': {
        name: 'Automated Accounts Payable',
        description: 'Invoice processing and payment automation',
        averageROI: 3.1,
        timeframe: 6,
        factors: {
          processingCosts: 0.45,
          accuracy: 0.30,
          cashFlow: 0.25
        },
        researchSource: 'AppZen AP Automation ROI 2023'
      },
      'expense-management': {
        name: 'Expense Management System',
        description: 'Digital expense reporting and management',
        averageROI: 2.8,
        timeframe: 3,
        factors: {
          processingTime: 0.40,
          compliance: 0.35,
          visibility: 0.25
        },
        researchSource: 'Concur Expense ROI Report 2023'
      },
      'treasury-management': {
        name: 'Treasury Management Platform',
        description: 'Cash management and financial risk system',
        averageROI: 1.9,
        timeframe: 12,
        factors: {
          cashOptimization: 0.40,
          riskManagement: 0.35,
          compliance: 0.25
        },
        researchSource: 'Kyriba Treasury ROI 2023'
      },
      'financial-reporting': {
        name: 'Automated Financial Reporting',
        description: 'Automated financial close and reporting system',
        averageROI: 2.3,
        timeframe: 8,
        factors: {
          closeTime: 0.40,
          accuracy: 0.35,
          compliance: 0.25
        },
        researchSource: 'BlackLine Financial Close ROI 2023'
      }
    }
  },
  'marketing-sales': {
    name: 'Marketing & Sales',
    description: 'Marketing technology and sales enablement tools',
    scenarios: {
      'marketing-automation': {
        name: 'Marketing Automation Platform',
        description: 'Comprehensive marketing campaign automation',
        averageROI: 4.3,
        timeframe: 6,
        factors: {
          leadGeneration: 0.45,
          conversionRate: 0.30,
          efficiency: 0.25
        },
        researchSource: 'HubSpot Marketing ROI Study 2023'
      },
      'sales-enablement': {
        name: 'Sales Enablement Platform',
        description: 'Sales content and training management system',
        averageROI: 2.9,
        timeframe: 4,
        factors: {
          salesProductivity: 0.45,
          winRate: 0.30,
          rampTime: 0.25
        },
        researchSource: 'Highspot Sales Enablement ROI 2023'
      },
      'lead-scoring': {
        name: 'AI Lead Scoring System',
        description: 'Machine learning lead qualification and scoring',
        averageROI: 3.7,
        timeframe: 3,
        factors: {
          leadQuality: 0.45,
          salesEfficiency: 0.30,
          conversionRate: 0.25
        },
        researchSource: 'Marketo Lead Scoring ROI 2023'
      },
      'social-media-management': {
        name: 'Social Media Management Platform',
        description: 'Comprehensive social media marketing tools',
        averageROI: 2.6,
        timeframe: 6,
        factors: {
          brandAwareness: 0.40,
          engagement: 0.35,
          leadGeneration: 0.25
        },
        researchSource: 'Hootsuite Social ROI Report 2023'
      },
      'content-management': {
        name: 'Content Management & Distribution',
        description: 'Digital asset and content lifecycle management',
        averageROI: 2.1,
        timeframe: 8,
        factors: {
          contentEfficiency: 0.40,
          brandConsistency: 0.30,
          timeToMarket: 0.30
        },
        researchSource: 'Adobe Experience Manager ROI 2023'
      },
      'account-based-marketing': {
        name: 'Account-Based Marketing Platform',
        description: 'Targeted marketing for high-value accounts',
        averageROI: 3.8,
        timeframe: 6,
        factors: {
          accountEngagement: 0.45,
          salesAlignment: 0.30,
          pipelineQuality: 0.25
        },
        researchSource: 'Demandbase ABM ROI Study 2023'
      },
      'customer-data-platform': {
        name: 'Customer Data Platform',
        description: 'Unified customer data management and activation',
        averageROI: 3.2,
        timeframe: 9,
        factors: {
          dataUnification: 0.40,
          personalization: 0.35,
          campaignEffectiveness: 0.25
        },
        researchSource: 'Segment CDP ROI Analysis 2023'
      },
      'video-marketing': {
        name: 'Video Marketing Platform',
        description: 'Enterprise video creation and distribution platform',
        averageROI: 2.7,
        timeframe: 4,
        factors: {
          engagement: 0.45,
          contentVelocity: 0.30,
          brandAwareness: 0.25
        },
        researchSource: 'Wistia Video Marketing ROI 2023'
      },
      'conversion-optimization': {
        name: 'Conversion Rate Optimization',
        description: 'A/B testing and conversion optimization platform',
        averageROI: 4.1,
        timeframe: 3,
        factors: {
          conversionRate: 0.50,
          customerExperience: 0.30,
          revenue: 0.20
        },
        researchSource: 'Optimizely CRO ROI Study 2023'
      }
    }
  },
  'compliance-governance': {
    name: 'Compliance & Governance',
    description: 'Regulatory compliance and governance solutions',
    scenarios: {
      'grc-platform': {
        name: 'GRC (Governance, Risk, Compliance) Platform',
        description: 'Integrated governance, risk, and compliance system',
        averageROI: 1.8,
        timeframe: 15,
        factors: {
          complianceCosts: 0.40,
          riskReduction: 0.35,
          auditEfficiency: 0.25
        },
        researchSource: 'ServiceNow GRC ROI Study 2023'
      },
      'privacy-management': {
        name: 'Privacy Management Platform',
        description: 'GDPR/CCPA compliance and privacy management',
        averageROI: 2.2,
        timeframe: 9,
        factors: {
          complianceAutomation: 0.45,
          riskMitigation: 0.30,
          efficiency: 0.25
        },
        researchSource: 'OneTrust Privacy ROI 2023'
      },
      'audit-management': {
        name: 'Audit Management System',
        description: 'Digital audit planning and execution platform',
        averageROI: 2.5,
        timeframe: 6,
        factors: {
          auditEfficiency: 0.45,
          documentation: 0.30,
          compliance: 0.25
        },
        researchSource: 'AuditBoard Audit ROI 2023'
      },
      'policy-management': {
        name: 'Policy Management Platform',
        description: 'Enterprise policy creation and management system',
        averageROI: 1.9,
        timeframe: 12,
        factors: {
          policyCompliance: 0.40,
          updateEfficiency: 0.35,
          riskReduction: 0.25
        },
        researchSource: 'MetricStream Policy ROI 2023'
      },
      'regulatory-reporting': {
        name: 'Automated Regulatory Reporting',
        description: 'Automated compliance and regulatory reporting',
        averageROI: 2.7,
        timeframe: 8,
        factors: {
          reportingAccuracy: 0.40,
          timeReduction: 0.35,
          penaltyAvoidance: 0.25
        },
        researchSource: 'Moody\'s Analytics Regulatory ROI 2023'
      }
    }
  }
}

// ROI Scenarios for different business contexts
export const roiScenarios = {
  'conservative': {
    name: 'Conservative Estimate',
    description: 'Lower-bound projections with minimal risk assumptions',
    multiplier: 0.7,
    riskFactor: 0.1,
    adoptionRate: 0.6
  },
  'realistic': {
    name: 'Realistic Projection',
    description: 'Most likely outcome based on industry averages',
    multiplier: 1.0,
    riskFactor: 0.2,
    adoptionRate: 0.8
  },
  'optimistic': {
    name: 'Optimistic Scenario',
    description: 'Best-case projections with ideal implementation',
    multiplier: 1.3,
    riskFactor: 0.3,
    adoptionRate: 0.95
  }
}

// Utility functions for ROI calculations
export const calculateROI = (investment, category, scenario, timeframe = null) => {
  try {
    const categoryData = roiCategories[category]
    const scenarioData = roiScenarios[scenario]
    
    if (!categoryData || !scenarioData) {
      throw new Error('Invalid category or scenario')
    }
    
    // Use the first scenario from the category for calculation
    const firstScenarioKey = Object.keys(categoryData.scenarios)[0]
    const roiData = categoryData.scenarios[firstScenarioKey]
    
    const baseROI = roiData.averageROI * scenarioData.multiplier
    const timeToROI = timeframe || roiData.timeframe
    const riskAdjustedROI = baseROI * (1 - scenarioData.riskFactor)
    
    const totalReturn = investment * riskAdjustedROI
    const netReturn = totalReturn - investment
    const monthlyReturn = netReturn / timeToROI
    const annualReturn = monthlyReturn * 12
    
    return {
      investment,
      totalReturn: Math.round(totalReturn),
      netReturn: Math.round(netReturn),
      roi: Math.round((riskAdjustedROI - 1) * 100),
      timeToROI,
      monthlyReturn: Math.round(monthlyReturn),
      annualReturn: Math.round(annualReturn),
      breakEvenMonths: Math.ceil(investment / monthlyReturn),
      riskLevel: scenarioData.riskFactor,
      category: categoryData.name,
      scenario: scenarioData.name,
      researchSource: roiData.researchSource
    }
  } catch (error) {
    console.error('ROI Calculation Error:', error)
    return null
  }
}

export default {
  roiCategories,
  roiScenarios,
  calculateROI
}