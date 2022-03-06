const geneerror=(err:any,typ:'path'|'message')=>{
    let errors :{ [key: string]: any[] } = {};
    if (typ==='path'){
                  Object.keys(err.errors).forEach((key) => {
                  errors[key] = err.errors[key].path;
                  });
                }
                else {
                  Object.keys(err.errors).forEach((key) => {
                    errors[key] = err.errors[key].message;
                    });
                }
  
                  return errors
  }
  export {geneerror}