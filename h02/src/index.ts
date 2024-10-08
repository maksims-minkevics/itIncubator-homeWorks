import {app} from "./app";

app.listen(process.env.PORT, () =>{
    console.log("started on -- " + process.env.PORT)
})