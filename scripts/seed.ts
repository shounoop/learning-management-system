const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

async function main() {
	const COURSE_IDS = [
		'0e2938dd-3db6-4228-b0fb-6b45fd7f33a3',
		'8ef3ea79-3528-47f2-90eb-e46ccdc7dccf',
		'cfcd141e-bb7b-46ec-a094-301cb044a6ee',
	];

	const QUESTION_IDS = [
		'32f2d9af-a77c-4182-ae88-a17e09f37221',
		'98aba880-34b9-49f4-9ade-d851e62842bb',
		'9da4c8d0-70e8-4712-9a6e-c12f1bff3a85',
	];

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
			await database.question.createMany({
				data: [
					{
						courseId: COURSE_IDS[0],
						correctAnswer: 'a',
						question: 'What is the best way to learn programming?',
					},
					{
						courseId: COURSE_IDS[0],
						correctAnswer: 'a',
						question: 'Why is programming so hard?',
					},
					{
						courseId: COURSE_IDS[1],
						correctAnswer: 'a',
						question: 'Which is the best music genre?',
					},
				],
			});

			console.log('Questions seeded successfully');
		} catch (error) {
			console.log('Error seeding the database questions: ', error);
		} finally {
			await database.$disconnect();
		}
	};

	const seedingAnswers = async () => {
		try {
			await database.answer.createMany({
				data: [
					{
						questionId: QUESTION_IDS[0],
						value: 'a',
						label: 'a) By doing it',
					},
					{
						questionId: QUESTION_IDS[0],
						value: 'b',
						label: 'b) By not doing it',
					},
					{
						questionId: QUESTION_IDS[0],
						value: 'c',
						label: 'c) By doing it',
					},
					{
						questionId: QUESTION_IDS[0],
						value: 'd',
						label: 'd) By doing it',
					},
					{
						questionId: QUESTION_IDS[1],
						value: 'a',
						label: 'a) By doing it',
					},
					{
						questionId: QUESTION_IDS[1],
						value: 'b',
						label: 'b) By not doing it',
					},
					{
						questionId: QUESTION_IDS[1],
						value: 'c',
						label: 'c) By doing it',
					},
					{
						questionId: QUESTION_IDS[1],
						value: 'd',
						label: 'd) By doing it',
					},
				],
			});

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
