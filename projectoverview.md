AI Intelligence Tracker
Project Overview and Functional Summary
1. Project Overview
AI Intelligence Tracker is an automated AI and technology news aggregation platform that discovers, processes, summarizes and organizes recent developments in the artificial intelligence industry.

The platform focuses on keeping readers informed about developments in AI, Machine Learning, Deep Learning, Generative AI, Agentic AI, research papers, model releases, frameworks, tools and industry announcements.

Instead of manually visiting multiple websites, users can access relevant developments through a centralized dashboard containing summarized articles, searchable metadata, categories and tags.

The system uses a Python-based collection worker, a cloud LLM for article processing, Supabase PostgreSQL for persistent storage and Next.js for the frontend.
2. Core Functional Workflow
1. Automated discovery
   
   A scheduled Python worker runs every 48 hours and discovers articles published within the rolling last 48 hours from configured sources.
2. Content extraction
   
   Extracts headlines, article content, publication dates, original URLs and available metadata.
3. Validation and deduplication
   
   Checks article relevance, validates extracted content and skips previously collected canonical URLs.
4. AI processing
   
   A cloud LLM generates summaries, categories, subcategories, development types, keywords, organizations, technologies and suggested tags.
5. Image discovery
   
   Finds suitable images from original article metadata, official sources or permitted image providers.
6. Database persistence
   
   Saves up to 25 newly accepted articles per collection run, including summaries, metadata, tags and source attribution.
7. Frontend publishing
   
   Newly collected articles become available through the Next.js dashboard for browsing, searching and filtering.

3. Collection Rules and Article Processing
Parameter	Decision
Collection frequency	Every 48 hours
Discovery window	Rolling last 48 hours
Maximum new articles	25 per run
Summary length	Approximately 100 words
Summarization	Cloud-based LLM
Tag generation	Hybrid AI + canonical tag registry
Verification	Source attribution and classification
Historical retention	Indefinite
Deduplication	Normalized canonical URL and URL hash

Different publishers covering the same development remain separate articles. Only duplicate URLs are rejected.

The system does not require mandatory multi-source corroboration for every article. Each published article must retain its original source attribution and link.
4. Technology Stack
Layer	Technology	Responsibility
Frontend	Next.js	Dashboard and article browsing
Frontend hosting	Vercel	Application deployment
Backend worker	Python	Article discovery and processing
Database	Supabase PostgreSQL	Persistent article and metadata storage
AI processing	Cloud LLM API	Summarization and classification
Image storage	Supabase Storage	Optional caching of permitted images
Scheduling	External scheduled execution environment	Runs worker every 48 hours

The Python worker runs independently of the Next.js frontend. Vercel is used for frontend hosting, not as a long-running Python worker.

No user authentication is required for the initial version. The public application provides read-only access to published content.
5. Database Schema Overview
The database uses a relational PostgreSQL structure. Supabase acts as the single source of truth.

It contains seven primary tables.
Table	Purpose
articles	Stores headlines, summaries, classifications, dates and metadata
sources	Maintains the registry of publishers and collection sources
tags	Stores canonical tags and their types
article_tags	Connects articles with multiple tags
article_media	Stores image references, credits and attribution
collection_runs	Records each scheduled or manual collection execution
collection_run_sources	Tracks the result of processing individual sources

Important database decisions:
- PostgreSQL handles structured article relationships.
- JSONB supports additional flexible metadata.
- Full-text search uses PostgreSQL search capabilities.
- GIN indexes support efficient text and array searches.
- Article URLs are hashed to prevent duplicate insertion.
- Historical articles are retained.
- No vector database is required for the MVP.
6. Dashboard and Frontend Functionality
The dashboard is the primary user-facing component. Its purpose is to make recent AI developments easy to discover and explore.
AI Intelligence Tracker
Dashboard concept

Search articles, technologies, companies...


Latest
AI Models
Agentic AI
Research
Frameworks


Latest developments










AI research and model developments

Publisher · Publication date

A concise summary explaining the development and its significance.
Research
Models














New frameworks and developer tools

Publisher · Publication date

A summary of the framework, its features and intended applications.
Frameworks
Developer Tools



Illustrative layout only. Final visual design will be defined in Design.md.
Dashboard features
Feature	Description
Latest articles	Displays newly collected articles
Article cards	Image, headline, summary, source and tags
Article detail view	Summary, key takeaways, metadata and original source link
Category navigation	Browse by AI subject area
Tag navigation	Discover related topics and technologies
Search	Search headlines, summaries and metadata
Filters	Category, tag, organization, technology, development type and date
Combined filtering	Apply multiple filters simultaneously
Sorting	Newest, oldest and relevance
Pagination	Retrieve articles in manageable batches

7. Article Classification
Every article receives one primary category.

The initial categories are:
- AI Models
- Agentic AI
- Generative AI
- Machine Learning
- Deep Learning
- AI Research
- AI Infrastructure
- AI Frameworks & Tools
- AI Industry
- AI Applications
- AI Safety & Policy
- Other
Development type is maintained separately. Examples include MODEL_RELEASE, MODEL_UPDATE, RESEARCH_PAPER, FRAMEWORK_RELEASE, BENCHMARK and PRODUCT_LAUNCH.

Tags provide another layer of discovery. The LLM proposes tags, while application logic normalizes them against a canonical registry to prevent inconsistent naming.
8. Article Detail Structure
Each article should expose the following information:
1. Headline.
2. Article image.
3. Approximately 100-word summary.
4. Key takeaways, when available.
5. Category and subcategory.
6. Development type.
7. Technologies and models.
8. Related companies and organizations.
9. Tags and keywords.
10. Publication date.
11. Publisher and source classification.
12. Original article link.
The platform provides summarized information and metadata rather than reproducing complete copyrighted articles.
9. Collection Monitoring
Every worker execution is recorded in the database.

The system tracks:
- Collection start and completion times.
- Sources processed.
- Articles discovered.
- Articles inserted.
- Duplicate articles skipped.
- Irrelevant articles rejected.
- Failed extractions or processing attempts.
- Overall execution status.
This provides a basic operational history and makes collection failures easier to diagnose.
10. Security and Deployment
- Public users can read published articles and public metadata.
- Public database writes are disabled through Supabase Row Level Security.
- The Python worker uses privileged database credentials stored in server-side environment variables.
- Secrets must never be exposed in frontend code.
- Manual collection triggers must be protected.
- Source URLs and extracted content must be validated.
- Image caching must respect licensing and usage permissions.
11. Project Scope
Included in the MVP
- Automated 48-hour article collection.
- Configurable source registry.
- Article extraction and validation.
- URL-based deduplication.
- Cloud LLM summarization and classification.
- Hybrid tag generation.
- Image discovery and source attribution.
- Supabase article storage.
- Search, filtering, sorting and pagination.
- Public dashboard.
- Collection execution logs.
Not included in the initial release
- User accounts and personalized feeds.
- Bookmarks and watchlists.
- Push notifications.
- Vector database and semantic retrieval.
- Automatic clustering of multiple articles covering the same event.
- Full article reproduction.
- Complex multi-agent orchestration.

12. Project at a Glance
AI Intelligence Tracker
Automated AI and technology news discovery platform
Collection interval

48 hours

Articles per run

Up to 25

Summary target

100 words

Database

PostgreSQL



Architecture
Frontend

Next.js + Vercel

Collection engine

Python

Database

Supabase

AI processing

Cloud LLM

Scheduler

External worker scheduler


In one sentence: AI Intelligence Tracker is a scheduled, source-driven news aggregation system that uses Python and cloud LLMs to turn recent AI developments into structured, searchable, summarized articles presented through a Next.js dashboard.