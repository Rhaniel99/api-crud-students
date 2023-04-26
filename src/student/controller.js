const pool = require('../../db');
const queries = require('./queries')

const getStudents = (req, res) => {
    pool.query(queries.getStudents, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getStudentsById = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getStudentsById, [id], (error, results) =>{
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};

const addStudent = (req, res) => {
    const {name, email, age, dob} = req.body;
    // checando se o email existe
    pool.query(queries.checkEmailExists, [email], (error, results) =>{
        if (results.rows.length){
            res.send("O email já existe.");
        }else{
        // adicionando cadastro ao banco
        pool.query(queries.addStudent, [name, email, age, dob], (error, results) => {
            if (error) throw error;
            res.status(201).send("Estudante cadastrado com sucesso!");
        });
        } 
    });
};

const removeStudent = (req, res) =>{
    const id = parseInt(req.params.id);
    
    pool.query(queries.getStudentsById, [id] , (error, results) =>{
        const noStudentFound = !results.rows.length;
        if (noStudentFound){
            res.send("O estudante não existe no banco e não pode ser removido.");
        }else{
            pool.query(queries.remStudent, [id], (error, results) =>{
                if (error) throw error;
                res.status(200).send("Estudante removido com sucesso.");
            });
        }
    });
};

const updateStudent = (req, res) =>{
    const id = parseInt(req.params.id);
    const { name } = req.body;

    pool.query(queries.getStudentsById,[id], (error, results) =>{
        const noStudentFound = !results.rows.length;
        if (noStudentFound){
            res.send("O estudante não existe no banco.");
        }else{
            pool.query(queries.updateStudent, [name, id], (error, results) =>{
                if (error) throw error;
                res.status(200).send("Estudante atualizado com sucesso.");
            });
        }
    });
};

module.exports = {
    getStudents,
    getStudentsById, 
    addStudent,
    removeStudent,
    updateStudent,
};