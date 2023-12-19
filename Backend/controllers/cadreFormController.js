const catchAsync = require('../utils/catchAsync');
const connection = require('../server');

const getType = catchAsync(async (req, res, next) => {
  const query = `
  SELECT
    report_type_id AS typeId,
    report_type_name AS typeName,
    'report' AS type
  FROM
    report_type

  UNION

  SELECT
    board_type_id AS typeId,
    type_name AS typeName,
    'advertisement' AS type
  FROM
    advertisement_type;
`;
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

const addFormType = catchAsync(async (req, res, next) => {
  const { type, typeName } = req.body;

  let tableName, idColumnName, nameColumnName;

  if (type === 'report') {
    tableName = 'report_type';
    idColumnName = 'report_type_id';
    nameColumnName = 'report_type_name';
  } else if (type === 'advertisement') {
    tableName = 'advertisement_type';
    idColumnName = 'board_type_id';
    nameColumnName = 'type_name';
  } else {
    return res.status(400).json({ error: 'Invalid type' });
  }

  // Check if the typeName already exists in the database
  const checkDuplicateQuery = `
  SELECT ${idColumnName} FROM ${tableName} WHERE ${nameColumnName} = ?;
`;

  connection.query(checkDuplicateQuery, [typeName], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error executing duplicate check query: ', checkError);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (checkResults.length > 0) {
      // typeName already exists, return an error
      return res.status(400).json({ error: 'Duplicate typeName' });
    }

    // Proceed to insert if typeName is not a duplicate
    const insertQuery = `
    INSERT INTO ${tableName} (${nameColumnName}) VALUES (?);
  `;

    connection.query(insertQuery, [typeName], (insertError, results) => {
      if (insertError) {
        console.error('Error executing insert query: ', insertError);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const typeId = results.insertId;

      res.status(200).json({ status: 'success', typeId, typeName, type });
    });
  });
});

const deleteForm = catchAsync(async (req, res, next) => {
  const { type, id } = req.body;

  let tableName, idColumnName;

  if (type === 'report') {
    tableName = 'report_type';
    idColumnName = 'report_type_id';
  } else if (type === 'advertisement') {
    tableName = 'advertisement_type';
    idColumnName = 'board_type_id';
  } else {
    return res.status(400).json({ error: 'Invalid type' });
  }

  const deleteQuery = `
    DELETE FROM ${tableName} WHERE ${idColumnName} = ?;
  `;

  connection.query(deleteQuery, [id], (error, results) => {
    if (error) {
      console.error('Error executing delete query: ', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Element not found' });
    }

    res.status(200).json({ status: 'success', message: 'Element deleted successfully' });
  });
});

const updateForm = catchAsync(async (req, res, next) => {
  const { type, id, updatedValue } = req.body;
  console.log(req.body);

  let tableName, idColumnName, valueColumnName;

  if (type === 'report') {
    tableName = 'report_type';
    idColumnName = 'report_type_id';
    valueColumnName = 'report_type_name';
  } else if (type === 'advertisement') {
    tableName = 'advertisement_type';
    idColumnName = 'board_type_id';
    valueColumnName = 'type_name';
  } else {
    return res.status(400).json({ error: 'Invalid type' });
  }

  const updateQuery = `
    UPDATE ${tableName} SET ${valueColumnName} = ? WHERE ${idColumnName} = ?;
  `;

  connection.query(updateQuery, [updatedValue, id], (error, results) => {
    if (error) {
      console.error('Error executing update query: ', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Element not found' });
    }

    res.status(200).json({ status: 'success', message: 'Element updated successfully' });
  });
});

module.exports = { getType, addFormType, deleteForm, updateForm };

