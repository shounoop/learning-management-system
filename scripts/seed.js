const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

const QUESTIONS = [
	'What is the best way to learn programming, and you are not sure if you can do it?',
	'Which of the following is not a programming language, and why, and what is the best way to learn it?',
	'Why do you want to learn programming, and what do you want to do with it?',
	'What do you think is the best way to learn programming, and you are not sure if you can do it, it is easy for me to learn?',
	'Why do they say that programming is hard, and what is the best way to learn it, what do you think about it, and you will be able to do it?',
];

const CORRECT_ANSWERS = [
	'a',
	'b',
	'c',
	'd',
	'ab',
	'ac',
	'ad',
	'bc',
	'bd',
	'cd',
	'abc',
	'abd',
	'acd',
	'bcd',
	'abcd',
];

const ANSWERS = [
	'By doing it right now and not later on in the future',
	'Say no more fam I got you fam',
	'Somehow, It is easy for me to learn',
	'Somehow not possible',
	'I am not sure if I can do it, but I will try',
	'The best way to learn programming is to do it right now and not later on in the future',
	'Nothing is impossible, and I will do it right now and not later on in the future',
	'Programming is hard, and I will do it right now and not later on in the future',
	'Programming is hard, and I will do it right now and not later on in the future, and I will do it right now and not later on in the future',
	'They say that programming is hard, and I will do it right now and not later on in the future',
];

async function main() {
	const seedingCategories = async () => {
		try {
			await database.category.createMany({
				data: [
					{ name: 'Computer Science' },
					{ name: 'Music' },
					{ name: 'Fitness' },
					{ name: 'Photography' },
					{ name: 'Accounting' },
					{ name: 'Engineering' },
					{ name: 'Filming' },
				],
			});

			console.log('Categories seeded successfully');
		} catch (error) {
			console.log('Error seeding the database categories: ', error);
		} finally {
			await database.$disconnect();
		}
	};

	const seedingQuestions = async () => {
		try {
			const courseIds = (
				await database.course.findMany({
					select: { id: true },
				})
			).map((course) => course.id);

			for (let i = 0; i < courseIds.length; i++) {
				const courseId = courseIds[i];

				const chapterIds = (
					await database.chapter.findMany({
						where: {
							courseId,
						},
						select: { id: true },
					})
				).map((chapter) => chapter.id);

				const data = QUESTIONS.map((question) => {
					const chapterId =
						chapterIds[Math.floor(Math.random() * chapterIds.length)];

					const correctAnswer =
						CORRECT_ANSWERS[Math.floor(Math.random() * CORRECT_ANSWERS.length)];

					return {
						courseId,
						chapterId,
						question,
						correctAnswer,
					};
				});

				await database.question.createMany({ data });
			}

			console.log('Questions seeded successfully');
		} catch (error) {
			console.log('Error seeding the database questions: ', error);
		} finally {
			await database.$disconnect();
		}
	};

	const seedingAnswers = async () => {
		try {
			const questionIds = (
				await database.question.findMany({
					select: { id: true },
				})
			).map((question) => question.id);

			for (let questionId of questionIds) {
				const data = ['a', 'b', 'c', 'd'].map((answer) => {
					return {
						value: answer,
						label: ANSWERS[Math.floor(Math.random() * ANSWERS.length)],
						questionId,
					};
				});

				await database.answer.createMany({ data });
			}

			console.log('Answers seeded successfully');
		} catch (error) {
			console.log('Error seeding the database answers: ', error);
		} finally {
			await database.$disconnect();
		}
	};

	// seedingCategories();
	// seedingQuestions();
	// seedingAnswers();
}

main();
