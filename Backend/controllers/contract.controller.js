const catchAsync = require('../utils/catchAsync');
const connection = require('../server'); // Sử dụng module quản lý kết nối cơ sở dữ liệu

const getContractById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  connection.query(`select * from contract where contract_id = ?`, [id], (err, results) => {
    res.status(200).json({
      status: 'success',
      point: results[0],
    });
  });
});

const createContract = catchAsync(async (req, res, next) => {
  const {
    company_name,
    company_email,
    company_phone,
    company_address,
    company_taxcode,
    start_date,
    end_date,
    representative,
  } = req.body;

  const queryInsert = `INSERT INTO contract 
  ( company_name, company_email, company_phone, company_address, company_taxcode, start_date, end_date, representative ) 
  VALUES ( ? ,?, ?, ?, ?, ?, ?, ? );`;

  connection.query(
    queryInsert,
    [
      company_name,
      company_email,
      company_phone,
      company_address,
      company_taxcode,
      start_date,
      end_date,
      representative,
    ],
    (error, result) => {
      if (error) {
        console.error('Error executing query: ' + error.stack);
        return res.status(401).json({
          error: 'Invalid Information.',
        });
      }

      console.log(result.insertId);

      res.status(200).json({
        status: 'success',
        data: { contract_id: result.insertId },
      });
    }
  );
});
module.exports = { getContractById, createContract };
