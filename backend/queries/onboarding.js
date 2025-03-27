const pool = require('../db');

const getQuestions = async () => {
    const result = await pool.query(
      'SELECT q.id, q.question, q.response_type, array_agg(jsonb_build_object(\'id\', o.id, \'option\', o.option)) as options ' +
      'FROM onboarding_questions q ' +
      'LEFT JOIN response_options o ON q.id = o.question_id ' +
      'GROUP BY q.id, q.question, q.response_type ' +
      'ORDER BY q.id ASC' // Added ORDER BY
    );
    return result.rows;
  };

const saveUserResponse = async (userId, questionId, answerIds) => {
  const question = (await pool.query('SELECT response_type FROM onboarding_questions WHERE id = $1', [questionId])).rows[0];
  if (!question) throw new Error('Question not found');

  // Delete existing responses for this question and user
  await pool.query('DELETE FROM user_responses WHERE user_id = $1 AND question_id = $2', [userId, questionId]);

  // Insert new responses
  if (Array.isArray(answerIds)) {
    for (const answerId of answerIds) {
      await pool.query(
        'INSERT INTO user_responses (user_id, question_id, answer_id) VALUES ($1, $2, $3)',
        [userId, questionId, answerId]
      );
    }
  } else {
    await pool.query(
      'INSERT INTO user_responses (user_id, question_id, answer_id) VALUES ($1, $2, $3)',
      [userId, questionId, answerIds]
    );
  }
};

module.exports = { getQuestions, saveUserResponse };