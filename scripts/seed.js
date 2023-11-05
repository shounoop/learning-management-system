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
				const data = QUESTIONS.map((question) => {
					return {
						courseId: courseIds[i],
						question,
						correctAnswer:
							CORRECT_ANSWERS[
								Math.floor(Math.random() * CORRECT_ANSWERS.length)
							],
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
			const questionIds = await database.question.findMany({
				select: { id: true },
			});

			const data = questionIds.map((questionId) => {
				return [
					{
						questionId,
						value: 'a',
						label: 'By doing it right now and not later on in the future',
					},
					{ questionId, value: 'b', label: 'Say no more fam I got you fam' },
					{
						questionId,
						value: 'c',
						label: 'Somehow, It is easy for me to learn',
					},
					{ questionId, value: 'd', label: 'Somehow not possible' },
				];
			});

			await database.answer.createMany({ data });

			console.log('Answers seeded successfully');
		} catch (error) {
			console.log('Error seeding the database answers: ', error);
		} finally {
			await database.$disconnect();
		}
	};

	// seedingCategories();
	seedingQuestions();
	// seedingAnswers();
}

main();
