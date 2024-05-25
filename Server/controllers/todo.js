import prisma from "../db.js";

export const createTodo = async(req,res) => {
        try{
            const { name,description } = req.body ;

            const todo =  await prisma.todo.create({
                data:{
                    name,
                    description
                }
            })

           return res.status(200).json({
            data:todo,
            status:true,
            msg:"Todo Created Successfully"
           })


        }catch(error) {
            return res.status(422).json({
                status: false,
                data: null,
                msg: error.message,
              });
        }
}


export const updateTodo = async(req,res) => {
    try{

        const { uuid,name,description } = req.body ;

        const todo =  await prisma.todo.update({
            where:{
              uuid
            },
            data:{
                name,
                description
            }
        })
       
       return res.status(200).json({
        data:todo,
        status:true,
        msg:"Todo Updated Successfully"
       })


    }catch(error) {

        return res.status(422).json({
            status: false,
            data: null,
            msg: error.message,
          });
    }
}

export const deleteTodo = async(req,res) => {
    try{

        const { uuid } = req.params ;

        const todo =  await prisma.todo.delete({
            where:{
              uuid
            },
           
        })
       
       return res.status(200).json({
        data:todo,
        status:true,
        msg:"Todo Deleted Successfully"
       })


    }catch(error) {

        return res.status(422).json({
            status: false,
            data: null,
            msg: error.message,
          });
    }
}

export const getTodos = async(req,res) => {
    
    try{
        const {take,skip} = req.params ;

        if (isNaN(take) || isNaN(skip) || take <= 0 || skip < 0) {
            return res.status(400).json({
              status: false,
              data: null,
              msg: "Invalid parameters: 'take' and 'skip' must be positive integers.",
            });
          }

        const todos =await prisma.todo.findMany({
            take:parseInt(take),
            skip:parseInt(skip)
        })

        const all = await prisma.todo.count()
      
       
        return res.status(200).json({
            data:{
                todos,
                all
              },
            status:true,
            msg:"Todo Fetched Successfully"
           })
    

    }catch(error){
        return res.status(422).json({
            status: false,
            data: null,
            msg: error.message,
          });
    }
}