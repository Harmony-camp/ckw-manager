
const env = import.meta.env.MODE || "prod";

const EnvConfig = {
  dev:{
    baseApi:"/api",
    mockApi:"https://www.fastmock.site/mock/fa4c18963ab634ec12a063962937ba52/api"
  },
  test:{
    baseApi:"https://www.fastmock.site/mock/fa4c18963ab634ec12a063962937ba52/api",
    mockApi:"https://www.fastmock.site/mock/fa4c18963ab634ec12a063962937ba52/api"
  },
  prod:{
    baseApi:"/api",
    mockApi:"https://www.fastmock.site/mock/fa4c18963ab634ec12a063962937ba52/api"
  }
}

export default{
  env:"dev",
  mock:false,
  namespace:'manage',
  ...EnvConfig[env]
}