import prisma from '../lib/prisma';
import { notFoundTo404 } from '../middleware/errorHandler';

// Phase 1 catalog field set (single source for list + detail).
const CATALOG_FIELDS = {
  id: true,
  slug: true,
  title: true,
  shortTitle: true,
  shortDescription: true,
  description: true,
  difficulty: true,
  duration: true,
  language: true,
  thumbnail: true,
  banner: true,
  certificateAvailable: true,
  prerequisites: true,
  learningOutcomes: true,
  targetAudience: true,
  skillsGained: true,
  tags: true,
  featured: true,
  price: true,
  status: true,
  comingSoon: true,
  category: { select: { slug: true, name: true } },
  modules: {
    select: { id: true, week: true, title: true, description: true },
    orderBy: { week: 'asc' }
  }
} as const;

/** Published catalog courses. moduleCount is DERIVED from the Module table. */
export const getCatalogCourses = async (categorySlug?: string) => {
  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {})
    },
    select: {
      ...CATALOG_FIELDS,
      _count: { select: { modules: true } }
    },
    orderBy: [{ featured: 'desc' }, { createdAt: 'asc' }]
  });

  return courses.map(c => ({
    ...c,
    moduleCount: c._count.modules,
    _count: undefined
  }));
};

export const getModuleByWeek = async (courseId: string, week: number, userId?: number) => {
  const moduleRecord = await prisma.module.findFirst({
    where: {
      courseId,
      week
    },
    include: {
      topics: {
        orderBy: {
          order: 'asc'
        }
      }
    }
  });

  if (!moduleRecord) return null;

  if (userId) {
    const topicIds = moduleRecord.topics.map(t => t.id);
    const progressRecords = await prisma.topicProgress.findMany({
      where: {
        userId,
        topicId: { in: topicIds }
      }
    });

    const topicsWithProgress = moduleRecord.topics.map(topic => {
      const progress = progressRecords.find((p: any) => p.topicId === topic.id);
      return {
        ...topic,
        completed: progress?.completed || false,
        quizPassed: progress?.quizPassed || false,
        quizScore: progress?.quizScore || null
      };
    });

    return {
      ...moduleRecord,
      topics: topicsWithProgress
    };
  }

  return moduleRecord;
};

/** Public detail for a course addressed by its slug OR legacy id (backward compatible). */
export const getPublicCourseDetails = async (slugOrId: string) => {
  const course = await prisma.course.findFirst({
    where: { OR: [{ slug: slugOrId }, { id: slugOrId }] },
    include: {
      category: { select: { slug: true, name: true } },
      modules: {
        select: {
          id: true,
          week: true,
          title: true,
          description: true,
          topics: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy: {
          week: 'asc'
        }
      }
    }
  });

  if (!course) return null;

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    shortTitle: course.shortTitle,
    shortDescription: course.shortDescription,
    description: course.description,
    category: course.category,
    difficulty: course.difficulty,
    duration: course.duration,
    language: course.language,
    thumbnail: course.thumbnail,
    banner: course.banner,
    certificateAvailable: course.certificateAvailable,
    prerequisites: course.prerequisites,
    learningOutcomes: course.learningOutcomes,
    targetAudience: course.targetAudience,
    skillsGained: course.skillsGained,
    tags: course.tags,
    featured: course.featured,
    price: course.price,
    status: course.status,
    comingSoon: course.comingSoon,
    moduleCount: course.modules.length,
    modules: course.modules.map(m => ({
      week: m.week,
      title: m.title,
      description: m.description,
      topicCount: m.topics.length,
      topics: m.topics
    }))
  };
};

export interface CourseWriteInput {
  id?: string;
  title?: string;
  description?: string;
  price?: number;
  banner?: string | null;
  thumbnail?: string | null;
  comingSoon?: boolean;
}

export const createCourse = async (data: CourseWriteInput) => {
  return await prisma.course.create({
    data: {
      id: data.id!,
      title: data.title!,
      description: data.description || '',
      price: data.price || 699,
      banner: data.banner ?? null,
      thumbnail: data.thumbnail ?? null,
      comingSoon: data.comingSoon ?? false
    }
  });
};

export const updateCourse = async (courseId: string, data: CourseWriteInput) => {
  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.banner !== undefined) updateData.banner = data.banner;
  if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
  if (data.comingSoon !== undefined) updateData.comingSoon = data.comingSoon;

  return await notFoundTo404(prisma.course.update({
    where: { id: courseId },
    data: updateData
  }), `Course ${courseId} not found`);
};

export const deleteCourse = async (courseId: string) => {
  return await notFoundTo404(prisma.course.delete({ where: { id: courseId } }), `Course ${courseId} not found`);
};

export const createModule = async (courseId: string, data: { week: number; title: string; description?: string }) => {
  return await prisma.module.create({
    data: {
      courseId,
      week: data.week,
      title: data.title,
      description: data.description || ''
    }
  });
};

export const updateModule = async (moduleId: number, data: { week?: number; title?: string; description?: string }) => {
  return await notFoundTo404(prisma.module.update({
    where: { id: moduleId },
    data
  }), `Module ${moduleId} not found`);
};

export const deleteModule = async (moduleId: number) => {
  return await notFoundTo404(prisma.module.delete({ where: { id: moduleId } }), `Module ${moduleId} not found`);
};

export const createTopic = async (moduleId: number, data: { title: string; text: string; code?: string; note?: string; order?: number }) => {
  return await prisma.topic.create({
    data: {
      moduleId,
      title: data.title,
      text: data.text,
      code: data.code,
      note: data.note,
      order: data.order || 0
    }
  });
};

export const updateTopic = async (topicId: number, data: { title?: string; text?: string; code?: string; note?: string; order?: number }) => {
  return await notFoundTo404(prisma.topic.update({
    where: { id: topicId },
    data
  }), `Topic ${topicId} not found`);
};

export const deleteTopic = async (topicId: number) => {
  return await notFoundTo404(prisma.topic.delete({ where: { id: topicId } }), `Topic ${topicId} not found`);
};
