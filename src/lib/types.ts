export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	technologies: string[];
	githubUrl?: string;
	liveUrl?: string;
	status: 'completed' | 'in-progress' | 'planned';
	featured: boolean;
}

export interface DevLogEntry {
	id: string;
	date: string;
	title: string;
	content: string;
	tags: string[];
	category: 'feature' | 'bug-fix' | 'learning' | 'update';
}
