
interface ReportRepositoryInterface {

    getAllReportedPosts() : Promise <any>,
    changeActionStatus(reportId : string) : Promise <any>,
  
}

export default ReportRepositoryInterface 
