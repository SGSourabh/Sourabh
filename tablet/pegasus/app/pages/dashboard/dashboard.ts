import {Component, OnInit, ElementRef, ViewChild, AfterViewInit} from "@angular/core";
import {NavController, LoadingController} from "ionic-angular";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {AppProvider} from "../../providers/app";
import {LogProvider} from "../../providers/log";
import {PrintComponent} from "../../components/print/print";
import {CalendarPage} from "../calendar/calendar";
import {LeadPage} from "../lead/lead";
import {CreatePage} from "../lead/create";
import {Appointment} from "../../models/appointment";
import {AppointmentProvider} from "../../providers/appointment";
import {LookupProvider} from "../../providers/lookup";
import {LeadProvider} from "../../providers/lead";
import {TabsPage} from "../lead/manager/tabs";
import * as moment from "moment";
import {UserProvider} from "../../providers/user";
import {Observable} from "rxjs/Observable";
import {DateMomentFormatPipe} from "../../pipes/date-moment-format";
import {CordovaProvider} from "../../providers/cordova";
import {DecimalPipe} from "@angular/common";
import {PROGRESSIVE_SAVER, TERM_DEPOSIT, NON_TERM_SAVINGS_ACCOUNT, FLEXIBLE_SAVINGS_ACCOUNT, FLEXIBLE_DEPOSIT} from "../../models/product";
import "chart.js/src/chart";
declare var Chart;

@Component({
    templateUrl: 'build/pages/dashboard/dashboard.html',
    pipes: [TranslatePipe, DateMomentFormatPipe],
    providers: [AppointmentProvider, LeadProvider],
    directives: [PrintComponent]
})
export class DashboardPage implements OnInit, AfterViewInit {
    now: Date;
    appointments: Appointment[];
    leadsummery=[];
    monthArray:string[];
    kpiScoreArry=[];
    oldestlead:any;
    kpiscore:any;
    //user_id='vi.mai';
    wordsOfDay:any;
    wordsOfDay1:any;
    wordsOfDay2:any;
    tipsClass:any;
    newlead:number;
    followUp:number;
    favourite:number;
    appointment=[];
    current_date:string;
    user_id=localStorage['user_id'];
    @ViewChild('lineCanvas') lineCanvas;
    chart :any;

    constructor(private logProvider: LogProvider,
                private navController: NavController,
                private loadingCtrl: LoadingController,
                private translateService: TranslateService,
                private appProvider: AppProvider,
                private appointmentProvider: AppointmentProvider,
                private leadProvider: LeadProvider,
                private lookupProvider: LookupProvider,
                private userProvider: UserProvider,
                private cordovaProvider: CordovaProvider) {
              // this.appointments = [];
              // this.leadsummery=[];
              // this.oldestlead=[];
           this.wordsOfDay='null';   
          this.oldestlead='null';
          logProvider.class(this);
          this.newlead=0;
         this.followUp=0;
         this.favourite=0;
    }

    ngOnInit() {
        let arry=["Cố gắng truyền đạt những lợi ích của sản phẩm đến khách hàng một cách ngắn gọn",
                "Sử dụng ngôn ngữ mạnh mẽ nhằm nhấn mạnh lợi ích sản phẩm nhưng biết kiểm soát",
                "Đừng Hành động quá thân thiện- Bạn sẽ trông thật “giả tạo”. Bạn nên tiếp cận một cách nhã nhặn, lịch sự và tôn trọng khách hàng.",
                "Đến trễ trong buổi gặp gỡ khách hàng- Bạn nên luôn luôn đến sớm 15 phút",
                "Hạn chế sử dụng các động từ phủ định  Không", " Anh/Chị sai rồi"," Anh/chị không biết gì cả…",
                "Nên tra cứu thông tin khách hàng trên hệ thống trước khi gặp gỡ thực tế.",
                "Thiếu hiểu biết về sản phẩm:  Khách hàng tương lai không muốn nghe những câu như “Tôi không rõ về điều này, để tôi giải thích với anh/chị sau.”...lặp đi lặp lại nhiều lần",
                "Nên nắm bắt thông tin về sản phẩm các ngân hàng: Lãi suất, phí, sản phẩm để tư vấn rõ nét cho khách hàng.",
                "Hãy giải đáp đầy đủ thắc mắc, khiếu nại của khách hàng chứ không phải làm lơ.",
                "Thường xuyên sử dụng nụ cười thân thiện và cởi mởi trong quá trình trao đổi với khách hàng, kể cả khi bạn nói chuyện với khách hàng qua điện thoại",
                "Ghi lại những lời phê bình của khách hàng để tỏ rõ bạn đang lắng nghe họ",
                "Viết một tấm thiệp cảm ơn, gọi điện hỏi khách hàng xem họ có hài lòng với sản phẩm/ dịch vụ không, duy trì mối liên hệ thường xuyên trong tương lai",
                "Chuẩn bị sẵn tài liệu cần có ( form mẫu..) và tờ ghi chú để gửi lại khách hàng những thông tin cồn chốt sau buổi nói chuyện",
                "Phân loại nhóm, độ tuổi khách hàng và nhu cầu KH theo từng độ tuổi để có thể nắm bắt tâm lý và tư vấn tốt hơn cho khách hàng.",
                "Luôn nghiên cứu về background của KH trước khi đi gặp KH để có một sự tự tin và sẵn sàng tư vấn cho KH trong mọi tình huống ứng  phó.",
                "Chuẩn bị sẵn kịch bản bán hàng và những thông tin liên quan đến sản phẩm mà khách hàng đang quan tâm để khai thác tối đa nhu cầu tiềm ẩn của KH",
                "Nghiên cứu kỹ thị trường về đối thủ cạnh tranh để có thể đưa ra những điểm mạnh về sản phẩm của NH mình và dồng thời, dễ dàng hơn trong khâu thuyết phục KH tin tưởng mình.",
                "Luôn tạo một diện mạo tự tin, chuyên nghiệp đối với KH",
                "Xây dựng một mạng lưới KH trung thành nhất định để lấy thêm data base của KH giới thiệu KH, đây là điểm mấu chốt để các Sale tinh nhuệ thành công",
                "Luôn luôn chăm sóc, quan tâm và lắng nghe KH mọi lúc, mọi khi để tạo niềm tin đối với KH và nhằm tăng thêm giá trị kết nối đối với KH ngày một thân thiết hơn.",
                "Sự dụng triệt để công cụ FHC nhằm khai thác và update thông tin KH thường xuyên để có thể tư vấn sản phẩm cần thiết cho KH trong mỗi giai đoạn cần thiết, tốt nhất.",
                "Mua thêm data base KH từ nhiều nguồn khác đáng tin cậy, để luôn vững vàng xây dựng data KH cho riêng mình ở mọi thời điểm chủ động.",
                "Tích cực kết nối và liên kết với các đồng nghiệp để giới thiệu KH cho mình như WS", "Driect Sale or chi nhánh khác cùng Vùng hoặc khác Vùng, bạn bè người thân để có thêm danh sách KH thân thiết",
                "Đừng rời khỏi vị trí khi bạn chưa Chiến đấu xong",
                "Ngày mai chắc chắn tôi sẽ làm tốt hơn hôm nay",
                "Sắp đến đích rồi cố lên bạn ơi",
                "Suy nghĩ tích cực, hành động tích cực kết quả tích cực",
                "Chuyển sợ hãi thành năng lực tích cực để trao đổi với khách hàng",
                "Hãy khen khách hàng bằng bất kỳ cái gì mình thấy khác hoặc nhìn bắt mắt",
                "Luôn luôn thể hiện sự lắng nghe chứng tỏ sự tôn trọng và biểu lộ sự quan tâm của bạn tới khách hàng",
                "Luôn sẵn sàng chia sẽ các thông tin mình có để hỗ trợ khách hàng tốt nhất",
                "Tập trung vào nội dung bạn cần trao đổi và tư vấn tới khách hàng, không nên bị ảnh hưởng bởi môi trường xung quanh",
                "Luôn kết nối với cảm xúc của khách hàng để điều chỉnh trạng thái phù hợp khi giao tiếp",
                "Luôn luôn duy trì giao tiếp bằng mắt thích hợp, nhìn vào điểm giữa của hai mắt",
                "4 Tạo quan hệ với KH bằng cách sử dụng bất kỳ thông tin nào bạn biết về KH",
                "Hãy luôn nhớ việc đặt một câu hỏi đúng còn có ý nghĩa hơn nhiều việc tìm câu trả lời đúng cho một câu hỏi sai",
                "Luôn nhấn mạnh vào “một cuộc đối thoại thú vị” hơn là vào mục tiêu bán hàng. ",
                "Nếu khách hàng hỏi tại sao tôi lại phải cung cấp thông tin này, hãy nói với khách hàng họ có thể đặt bất cứ câu hỏi nào và xin phép khách hàng sẽ đưa ra câu trả lời gợi ý vào cuối cuộc trò chuyện này",
                "Hãy nhớ ấn tượng ban đầu là ấn tượng cuối cùng, vì vậy hãy chuẩn bị kỹ kịch bản 30' tạo ấn tượng ban đầu",
                "Khách hàng thích về sự tiện dụng trong giao dịch, đừng quyên giới thiệu với khách hàng về hình thức gửi tiết kiệm Online nhé",
                "Đừng quên hỏi khách hàng về những khó khăn, sự hài lòng của khách hàng khi khách hàng giao dịch với ngân hàng - điều này sẽ giúp cho các bạn hiểu rõ mong muốn thực sự của khách hàng về lợi ích sản phẩm khi giao dịch với ngân hàng",
                "Khi bạn thảo luận với khách hàng về mục tiêu ưu tiên, hãy nhớ trả lời các câu hỏi sau: để thực hiện được mục tiêu đó khách hàng sẽ phải đối mặt với những khó khăn gì và bạn hỗ trợ được gì cho khách hàng để giải quyết những khó khăn đó",
                "Đặt câu hỏi đúng lúc và có mục đích sẽ giúp cho đề xuất của bạn có ý nghĩa hơn",
                "Nhu cầu của mỗi con người thay đổi theo thời gian, vì vậy chúng ta luôn cần cập nhập và tìm hiểu những thông tin thay đổi này để đấp ứng một cách tốt nhất nhu cầu của khách hàng",
                "Chúng ta có trách nhiệm giúp cho khách hàng khám phá và đề xuất sản phẩm đáp ứng được mong muốn, nhu cầu của khách hàng",
                "Hãy bán những gì khách hàng cần, đừng bán những thứ chúng ta có",
                "Hãy đặt mình vào vị trí của khách hàng để đồng cảm và hiểu được mong muốn, nhu cầu của khách hàng",
                "Hãy luôn nhớ sử dụng 5 hành vi để kết nối với khách hàng trong suốt cuộc trò chuyện",
                "Hãy luôn luôn phục vụ khách hàng tốt nhất có thể, khi hoàn thành hẳn nhiên khách hàng sẽ luôn nhớ đến bạn và sẽ tự nguyện giới thiệu khách hàng mới cho bạn khi phát sinh nhu cầu",
                "Luôn đồng cảm và tìm ra giải pháp để giúp khách hàng đạt được nhu cầu tài chính của khách hàng",
                "Lúc đầu nhớ gọi tên khách hàng và đôi khi nhắc lại trong lúc trao đổi với khách hàng để tạo không khí thân thiện và quan tâm cởi mở đối với khách hàng , hướng tới khách hàng.",
                "Thực hiện tác phong chuyên nghiệp và giữ khoảng cách vừa phải khi trao đổi chuyện với khách hàng (tùy từng tình huống cụ thể)",
                "Kiên nhẫn lắng nghe những khiếu nại của khách hàng và xử lý một cách dung hòa để tránh phản ứng gay gắt và tạo lòng tin đối với khách hàng , sau đó khách hàng sẽ dễ theo mình để được phục vụ",
                "Thỉnh thoảng gọi điện thoại hỏi thăm sức khỏe , tình hình và nhu cầu tài chính phát sinh thêm của khách hàng để tăng được doanh số cũng như Win Win luôn nhu cầu thêm của khách hàng -> thể hiện tầm nhìn VIB hướng tới khách hàng",
                "Có thể sắp vào dịp lễ nào đó như: sinh nhật, 2/9, 30/4, tết tây, tết ta, gọi điện chăm sóc nói chuyện với khách hàng để hiểu thêm về khách hàng từ đó có tư vấn tài chính phù hợp cho tương tai gần hoặc xa.",
                "Có phương pháp tiếp cận khác biệt hơn so với thông thường, chẳng hạn có thêm dịch vụ gia tăng bên cạnh những dịch vụ thường có để khách hàng thấy mình được chăm sóc nhiều hơn",
                "Thường xuyên cập nhật thêm thông tin bên ngoài chẳng hạn: chứng khoán, tài chính, đời sống , khoa học, showbit để khi trao đổi với khách hàng có thêm nhiều chia sẻ thú vị hơn và tư vấn phù hợp cho khách hàng hơn",
                "Định kì họp team để chia sẽ thành công, tạo sự sự tin  và tạo kịch bản bán hàng hiệu quả nhất để gia tăng sự thành công trong khi bán hàng",
                "Bạn dừng gặp KH là vội BÁN ngay mà hãy trò chuyện với KH như một người BẠN rồi sau đó mới BÁN;",
                "Khách hàng sẽ cảm thấy hài lòng khi bạn cung cấp chất lượng dịch vụ vượt trội ngoài sự mong đợi của KH",
                "Sự khiếu nại của KH không phải là điều đáng sợ mà là cơ hội bán hàng khi chúng ta giải quyết được điều đó cho khách hàng",
                "Theo đuổi đam mê bán hàng, thành công sẽ theo đuổi bạn",
                "Đừng lơ là KHÁCH HÀNG NỘI BỘ, đó là tài nguyên để bạn có thể mở rộng hệ khách hàng của bản thân",
                "Hãy note lại tất cả các thông tin khi đi gặp KH - Một cái bút chì cùn vẫn tốn hơn một trí óc tốt",
                "Xây dựng mối quan hệ với khách hàng là việc làm thường xuyên chứ không phải là lúc nào bạn cần BÁN bạn mới liên lạc với khách hàng",
                "Hãy làm cho khách hàng cảm thấy sản phẩm của VIB là giải pháp tài chính cho họ",
                "Nghiên cứu sản phẩm dịch vụ của NH bạn sẽ giúp chúng ta có cơ sở để tìm ra điểm vượt trội trong sản phẩm của VIB để thuyết phục KH;",
                "Khen khách hàng là cách mở đầu một câu chuyện gần gũi nhất",
                "Nếu khách hàng thích bạn, họ sẽ lắng nghe bạn . Bạn cần nhận biết được điều này.",
                "Điều quan trọng là luôn đặt mình vào vị trí Khách hàng để nói chuyện.",
                "Hãy hiểu mong muốn của khách hàng để biết cách thuyết phục họ. Điều đó có nghĩa là bạn phải biết lắng nghe",
                "Bạn cần biết đặt mục tiêu cho bản thân và lên kế hoạch thực hiện điều đó",
                "Thái độ tích cực trước mỗi vấn đề cho phép bạn biến những suy nghĩ tiêu cực trở nên tích cực trong bất kì trường hợp nào",
                "Công việc kinh doanh đòi hỏi sự kiên trì và mức độ đeo bám hợp lý, cái bạn hướng tới là xây dựng một mối quan hệ chứ không phải là thành tích bám trụ.",
                "Anh không thể chỉ hỏi khách hàng xem họ muốn gì và rồi cố đem nó cho họ. Tới lúc anh hoàn thiện nó, họ đã muốn thứ mới mẻ khác rồi.",
                "Thành công hay thất bại trong kinh doanh là do thái độ trong suy nghĩ nhiều hơn là khả năng suy nghĩ.",
                "Kiên nhẫn, nhiệt tình ngay cả khi khách hàng từ chối sản phẩm và trong những tình huống khó khăn nhất.",
                "Tạo ấn tượng ban đầu với khách hàng sẽ giúp cho việc bán hàng của bạn diễn ra được thuận lợi hơn, do đó bạn nên chuẩn bị cho mình từ tác phong, lời nói đến cách ăn mặc và tất cả các cử chỉ",
                "Tăng tần suất giao tiếp với khách hàng trong mỗi giao dịch để có thể hiểu biết thêm về khách hàng của chúng ta",
                "Ghi chép lại đầy đủ thông tin chi tiết nhất có thể về các khách hàng mình quản lý",
                "Đừng quên bán sản phẩm gửi góp cho các khách hàng trẻ tuổi và có lý do "," chưa có tiền tham gia bảo hiểm",
                "Hãy cố gắng tìm hiểu về tất cả các sản phẩm dịch vụ mà VIB có chứ không chỉ gói gọn trong sản phẩm của riêng bộ phận mình hay sản phẩm mà mình có chỉ tiêu KPI",
                "Hãy luôn mỉm cười trong bất cứ tình huống nào và với bất kể ai",
                "Khách hàng thất vọng nhất khi cảm giác người bán hàng chỉ tạt qua để tán gẫu",
                "Nếu muốn khách hàng quan tâm tới bạn, hãy gây ra ngạc nhiên cho khách hàng. Mục tiêu gây ngạc nhiên phải khuyến khích khách hàng phản hồi vì họ tò mò.",
                "Suy nghĩ như khách hàng - Đặt bạn vào vị trí của khách hàng và xem những đề nghị/giải pháp của bạn được cân nhắc như thế nào và nó giúp khách hàng đạt được mục đích của mình như thế nào.",
                "Không người bán hàng giỏi nào được sinh ra, chỉ có những đứa trẻ có sự tự tin vào bản thân mới được sinh ra.",
                "Trong cuộc đời con người có hai ngày quan trọng nhất, dó là ngày được sinh ra và ngày biết tại sao. Khi bạn biết được mục tiêu, sứ mệnh của mình, bạn theo đổi nó và bạn sẽ là người thành công.",
                "Bạn là một thỏi nam châm sống. Những gì bạn hút vào trong cuộc đời luôn phù hợp với những suy nghĩ chi phối trong đầu bạn.",
                "Đề có thể thành công trong bán hàng, diều đầu tiên bạn cần thay đổi suy nghĩ của mình, Bạn phải luôn tưởng tượng ra các giao dịch thành công với khách hàng."]


          //alert(arry.length)
        let vale=this.translateService.instant('compliance');
        //alert(JSON.stringify(vale))
       // alert(JSON.stringify(vale.length))
        let ran= Math.floor(Math.random()*(95)+1);
         this.wordsOfDay=arry[ran];
         this.wordsOfDay1=arry[ran-1];
         this.wordsOfDay2=arry[ran+1];
         if(ran %2 ==0){
           this.tipsClass="even";
         }else if(ran %5 ==0){
           this.tipsClass="odd2"  
         }else{
            this.tipsClass="odd1" 
         }
        this.now = new Date();
        let date=this.now.toISOString();
        let sub="Z";
        if(date.indexOf(sub) !== -1){
        var urgentpost = date.split("Z");
        this.current_date =urgentpost[0]; 
        }
        let month=this.now.getMonth();
         switch (month) {
            case 0: 
                  this.monthArray=["Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
                  break;           
            case 1:
                  this.monthArray=["Aug", "Sept","Oct", "Nov", "Dec", "Jan"];
                  break; 
            case 2:
                  this.monthArray=["Sept", "Oct", "Nov", "Dec", "Jan", "Feb"];
                  break; 
            case 3:
                  this.monthArray=["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
                  break; 
            case 4:
                  this.monthArray=["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
                  break; 
            case 5: 
                  this.monthArray=["Dec", "Jan", "Feb", "Mar", "Apr", "May"];
                  break;            
            case 6:
                  this.monthArray=["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
                  break; 
            case 7:
                  this.monthArray=["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
                  break; 
            case 8:
                  this.monthArray=["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
                  break; 
            case 9:
                  this.monthArray=["Apr", "May", "Jun", "Jul", "Aug", "Sept"];
                  break; 
            case 10:
                  this.monthArray=["May", "Jun",  "Jul", "Aug", "Sept", "Oct"];
                  break; 
            case 11:
                  this.monthArray=["Jun",  "Jul", "Aug", "Sept", "Oct", "Nov"];
            default:
                this.appProvider.createAlert(this.translateService.instant('message.invalid'));


        }   

        let sort = this.appProvider.current.leadsFilter === 'urgent' ? 'id' : '-id'; 
         let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
         Observable.fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => Observable.forkJoin(
                this.leadProvider.readOldest(),
                this.userProvider.userKpiScore(this.user_id),
                this.leadProvider.readSummeryDashboard(this.user_id),
                this.appointmentProvider.readEnrichedAppointments({from: this.current_date, to: this.current_date, creator: this.user_id}),
                this.leadProvider.readLeads(sort)
                ))
            .subscribe(data =>
                    loading.dismiss().then(() =>{ 
                        this.newlead=80;
                           this.oldestlead=data[0];
                           this.kpiscore=data[1];
                           this.leadsummery=data[2];
                           this.appointments = data[3];
                          if(this.oldestlead.length==0){
                           this.oldestlead='null';
                          }
                          for(let i=0;i<this.kpiscore.length;i++){
                              this.kpiScoreArry.push(Math.round(this.kpiscore[i].kpiScore))
                          }
                          if(this.leadsummery){
                            this.newlead=Math.round((this.leadsummery['new']*100)/this.leadsummery['total']);
                            this.followUp=Math.round((this.leadsummery['followup']*100)/this.leadsummery['total']);
                            this.favourite=Math.round((this.leadsummery['favorite']*100)/this.leadsummery['total']);
                          }

                      }),
                error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error, () => this.ngOnInit()).present())
            );
    }

     ngAfterViewInit() {
       
        this.chart = new Chart(this.lineCanvas.nativeElement.getContext("2d"), {
 
            type: 'line',
            data: {
                labels: this.monthArray,
                datasets: [
                    {
                        fill: true,
                        lineTension: 0,
                        backgroundColor: "rgba(255,255,255,0.2)",
                        borderWidth: 3,
                        borderColor: "#fbb817",
                        pointBorderColor: "#FF8000",
                        pointBackgroundColor: "#fbb817",
                        pointRadius: 5,
                        pointHoverRadius: 5,
                        data: this.kpiScoreArry,
                        spanGaps: false,
                    }
                ]
            },
            options: {
                layout: {
                    padding: {
                        left: 10,
                        right: 20,
                        top: 20,
                        bottom: 10
                    }
                },
                legend: {
                    display: false
                },
                tooltips: {
                    enabled: true,
                    backgroundColor: "#f89420",
                    displayColors: false,
                    titleFontSize: 20,
                    titleFontStyle: "normal",
                    titleMarginBottom: 10,
                    bodyFontSize: 20,
                    bodyFontStyle: "normal",
                    footerFontStyle: "normal",
                    footerMarginTop: 10,
                    caretSize: 10,
                    xPadding: 10,
                    yPadding: 10,
                   
                },
                scales: {
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: this.translateService.instant('dashboard.kpi'),
                            fontColor: 'white'
                        },
                        gridLines: {
                            color: 'rgba(255,255,255,0.3)'
                        },
                        ticks: {
                            fontColor: 'white'
                        }
                    }],
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: this.translateService.instant('dashboard.month'),
                            fontColor: 'white'
                        },
                        gridLines: {
                            color: 'rgba(255,255,255,0.3)'
                        },
                        ticks: {
                            fontColor: 'white'
                        }
                    }]
                }
            }
 
        });
    }

    onCalendar() {
        this.navController.setRoot(CalendarPage, {}, this.appProvider.navOptions);
    }

    onLeadRelationshipManager(appointment: Appointment) {
        let loading = this.loadingCtrl.create({content: this.translateService.instant('action.processing')});
        Observable
            .fromPromise(loading.present())
            .flatMap(() => this.cordovaProvider.checkMainApi())
            .flatMap(data => this.leadProvider.readLead(appointment.leadId))
            .subscribe(data => {
                    loading.dismiss().then(() => {
                        this.appProvider.current.buildLead(data);
                        this.navController.setRoot(TabsPage, {}, this.appProvider.navOptions)
                    });
                },
                error =>
                    loading.dismiss().then(() => this.appProvider.createAlert(error).present())
            );
    }

    onLead(filter: string) {
        this.appProvider.current.leadsFilter = filter;
        this.navController.setRoot(LeadPage, {}, this.appProvider.navOptions);
    }

    onLeadAdd() {
        this.navController.push(CreatePage);
    }
}
