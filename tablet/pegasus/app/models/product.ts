// product types
export const MORTGAGE_LOANS = 'mortgage_loans';
export const AUTO_LOANS = 'auto_loans';
export const BUSINESS_LOANS = 'business_loans';
export const PERSONAL_LOANS = 'personal_loans';
// sales groups
export const PROGRESSIVE_SAVER = 'progressive_saver';
export const TERM_DEPOSIT = 'term_deposit';
//export const ONLINE_TERM_DEPOSIT = 'online_term_deposit';
export const FLEXIBLE_DEPOSIT = 'flexible_deposit';
export const FLEXIBLE_SAVINGS_ACCOUNT = 'flexible_savings_account';
export const NON_TERM_SAVINGS_ACCOUNT = 'non_term_savings_account';
//export const ONLINE_FLEXIBLE_SAVINGS_ACCOUNT = 'online_flexible_savings_account';

export const PLATINUM_DOUBLE_CASH_BACK = 'platinum_double_cash_back';
export const GOLD_CREDIT_CARD = 'gold_credit_card';
export const PLATINUM_DEBIT_CARD = 'platinum_debit_card';
export const CLASSIC_DEBIT_CARD = 'classic_debit_card';

export enum ProductCategory {
    LENDING, CURRENT, SAVING, CREDIT, DEBIT
}

export interface ProductData {
    product: string;
    icon: string;
    salesGroups: SalesGroupData[];
    category: ProductCategory;
}

export interface SalesGroupItem {
    icon: string;
    header: string;
    description: string;
}

export interface SalesGroupData {
    salesGroup: string;
    tabs: string[];
    likeid: string;
    items: SalesGroupItem[];
}

export const PRODUCTS: ProductData[] = [
    {
        product: MORTGAGE_LOANS,
        icon: 'prd_mortgage-loans.svg',
        salesGroups: [
            {
                salesGroup: 'certified_home_land_apartment',
                tabs: ['compare', 'promotion','method', 'conditions'],
                likeid:'null',
                items: [
                    {
                        icon: 'bft_calendar-time.svg',
                        header: 'Thời gian vay vốn dài',
                        description: 'Thời gian cho vay tối đa 25 năm'
                    },
                    {
                        icon: 'bft_performance.svg',
                        header: 'Số tiền cho vay cao',
                        description: 'Số tiền cho vay tối đa 70% giá trị mua bán thực tế giữa bên mua & bên bán'
                    },
                    {
                        icon: 'bft_house.svg',
                        header: 'Vay mua nhà cho người thân',
                        description: 'Cho phép vay vốn để xây dựng, sửa chữa nhà cho bố/mẹ/con ruột của khách hàng'
                    },
                    {
                        icon: 'bft_atm.svg',
                        header: 'Giải ngân linh hoạt',
                        description: 'Giải ngân trước khi hoàn tất bảo đảm tiền vay hoặc trước khi ký HĐMB công chứng'
                    }
                ]
            },
            {
                salesGroup: 'certified_mixed_home',
                tabs: ['compare', 'promotion','method', 'conditions'],
                likeid:'null',
                items: [
                    {
                        icon: 'bft_calendar-time.svg',
                        header: 'Thời gian vay vốn dài',
                        description: 'Thời gian cho vay tối đa 25 năm'
                    },
                    {
                        icon: 'bft_performance.svg',
                        header: 'Số tiền cho vay cao',
                        description: 'Số tiền cho vay tối đa 70% giá trị mua bán thực tế giữa bên mua & bên bán'
                    },
                    {
                        icon: 'bft_house.svg',
                        header: 'Vay mua nhà cho người thân',
                        description: 'Cho phép vay vốn để xây dựng, sửa chữa nhà cho bố/mẹ/con ruột của khách hàng'
                    },
                    {
                        icon: 'bft_atm.svg',
                        header: 'Giải ngân linh hoạt',
                        description: 'Giải ngân trước khi hoàn tất bảo đảm tiền vay hoặc trước khi ký HĐMB công chứng'
                    }
                ]
            },
            {
                salesGroup: 'uncertified_land_house_villa_apartment',
                tabs: ['compare', 'promotion','method', 'conditions'],
                likeid:'null',
                items: [
                    {
                        icon: 'bft_calendar-time.svg',
                        header: 'Thời gian vay vốn dài',
                        description: 'Thời gian cho vay tối đa 25 năm'
                    },
                    {
                        icon: 'bft_performance.svg',
                        header: 'Số tiền cho vay cao',
                        description: 'Số tiền cho vay tối đa 70% giá trị mua bán thực tế giữa bên mua & bên bán'
                    },
                    {
                        icon: 'bft_house.svg',
                        header: 'Vay mua nhà cho người thân',
                        description: 'Cho phép vay vốn để xây dựng, sửa chữa nhà cho bố/mẹ/con ruột của khách hàng'
                    },
                    {
                        icon: 'bft_atm.svg',
                        header: 'Giải ngân linh hoạt',
                        description: 'Giải ngân trước khi hoàn tất bảo đảm tiền vay hoặc trước khi ký HĐMB công chứng'
                    }
                ]
            },
            {
                salesGroup: 'auction_method',
                tabs: ['compare', 'promotion','method', 'conditions'],
                likeid:'null',
                items: [
                    {
                        icon: 'bft_calendar-time.svg',
                        header: 'Thời gian vay vốn dài',
                        description: 'Thời gian cho vay tối đa 25 năm'
                    },
                    {
                        icon: 'bft_performance.svg',
                        header: 'Số tiền cho vay cao',
                        description: 'Số tiền cho vay tối đa 70% giá trị mua bán thực tế giữa bên mua & bên bán'
                    },
                    {
                        icon: 'bft_house.svg',
                        header: 'Vay mua nhà cho người thân',
                        description: 'Cho phép vay vốn để xây dựng, sửa chữa nhà cho bố/mẹ/con ruột của khách hàng'
                    },
                    {
                        icon: 'bft_atm.svg',
                        header: 'Giải ngân linh hoạt',
                        description: 'Giải ngân trước khi hoàn tất bảo đảm tiền vay hoặc trước khi ký HĐMB công chứng'
                    }
                ]
            },
            {
                salesGroup: 'transferred_state_owned_home',
                tabs: ['compare', 'promotion','method', 'conditions'],
                likeid:'null',
                items: [
                    {
                        icon: 'bft_house.svg',
                        header: 'Vay mua nhà cho người thân',
                        description: 'Cho phép vay vốn để mua nhà cho bố/mẹ/con ruột của KH'
                    },
                    {
                        icon: 'bft_calendar-time.svg',
                        header: 'Thời gian vay vốn dài',
                        description: 'Thời gian cho vay tối đa 25 năm'
                    },
                    {
                        icon: 'bft_atm.svg',
                        header: 'Giải ngân linh hoạt',
                        description: 'Cho phép giải ngân song song'
                    },
                    {
                        icon: 'bft_stats-down.svg',
                        header: 'Lãi suất cho vay ưu đãi',
                        description: 'VIB liên tục triển khai các gói lãi suất cho vay ưu đãi, cạnh tranh'
                    }
                ]
            },
            {
                salesGroup: 'construction_renovation',
                tabs: ['compare', 'promotion','method', 'conditions'],
                likeid:'null',
                items: [
                    {
                        icon: 'bft_house.svg',
                        header: 'Vay mua nhà cho người thân',
                        description: 'Cho phép vay vốn để mua nhà cho bố/mẹ/con ruột của KH'
                    },
                    {
                        icon: 'bft_calendar-time.svg',
                        header: 'Thời gian vay vốn dài',
                        description: 'Thời gian cho vay tối đa 15 năm'
                    },
                    {
                        icon: 'bft_house-blocks.svg',
                        header: 'Đáp ứng nhiều mục đích vay',
                        description: 'Đáp ứng các mục đích cho vay xây sửa khác nhau bao gồm cả sửa nhà nhưng mới chỉ có GCN QSDĐ'
                    },
                    {
                        icon: 'bft_stats-down.svg',
                        header: 'Lãi suất cho vay ưu đãi',
                        description: 'VIB liên tục triển khai các gói lãi suất cho vay ưu đãi, cạnh tranh'
                    }
                ]
            }
        ],
        category: ProductCategory.LENDING
    },
    {
        product: BUSINESS_LOANS,
        icon: 'prd_business-loans.svg',
        salesGroups: [
            {
                salesGroup: 'individual_business',
                tabs: ['compare', 'promotion','method', 'conditions'],
                likeid:'null',
                items: [
                    {
                        icon: 'bft_stats-down.svg',
                        header: 'Lãi suất cho vay',
                        description: 'Lãi suất cho vay ưu đãi'
                    },
                    {
                        icon: 'bft_suitcase.svg',
                        header: 'Vốn tự có',
                        description: 'Yêu cầu vốn tự có của KH thấp 25%'
                    },
                    {
                        icon: 'bft_calendar-time.svg',
                        header: 'Thời gian vay vốn dài',
                        description: 'Tối đa 7 năm'
                    },
                    {
                        icon: 'bft_atm.svg',
                        header: 'Giải ngân linh hoạt',
                        description: 'Một lần hoặc nhiều lần'
                    }
                ]
            },
            {
                salesGroup: 'micro_sme',
                tabs: ['compare', 'promotion','method', 'conditions'],
                likeid: 'null',
                items: [
                    {
                        icon: 'bft_stats-down.svg',
                        header: 'Lãi suất cho vay',
                        description: 'Lãi suất cho vay ưu đãi'
                    },
                    {
                        icon: 'bft_atm.svg',
                        header: 'Giải ngân linh hoạt',
                        description: 'Một lần hoặc nhiều lần'
                    },
                    {
                        icon: 'bft_calendar.svg',
                        header: 'Phương thức trả nợ linh hoạt',
                        description: 'Tùy vào dòng tiền'
                    },
                    {
                        icon: 'bft_stats-increase.svg',
                        header: 'Số tiền cho vay cao',
                        description: 'Không giới hạn'
                    }
                ]
            }
        ],
        category: ProductCategory.LENDING
    },
    {
        product: AUTO_LOANS,
        icon: 'prd_auto-loans.svg',
        salesGroups: [
            {
                salesGroup: 'personal_new_auto',
                tabs: ['compare', 'promotion','method', 'conditions'],
                likeid:'null',
                items: [
                    {
                        icon: 'bft_car.svg',
                        header: 'MỨC CHO VAY CAO',
                        description: 'Tối đa trên giá trị mua : 80%'
                    },
                    {
                        icon: 'bft_calendar-time.svg',
                        header: 'THỜI GIAN VAY VỐN DÀI',
                        description: 'Thời gian cho vay tối đa 8 năm'
                    },
                    {
                        icon: 'bft_atm.svg',
                        header: 'PHƯƠNG THỨC GIẢI NGÂN LINH HOẠT',
                        description: 'Cho phép giải ngân khi có giấy hẹn đăng ký xe'
                    },
                    {
                        icon: 'bft_stats-down.svg',
                        header: 'LÃI SUẤT ÁP DỤNG',
                        description: 'VIB liên tục triển khai các gói Lãi suất cho vay ưu đãi, cạnh tranh'
                    }
                ]
            },
            {
                salesGroup: 'personal_used_auto',
                tabs: [ 'compare', 'promotion','method', 'conditions'],
                likeid:'null',
                items: [
                    {
                        icon: 'bft_car.svg',
                        header: 'MỨC CHO VAY CAO',
                        description: 'Tối đa trên giá trị mua : 80%'
                    },
                    {
                        icon: 'bft_calendar-time.svg',
                        header: 'THỜI GIAN VAY VỐN DÀI',
                        description: 'Thời gian cho vay tối đa 6 năm'
                    },
                    {
                        icon: 'bft_atm.svg',
                        header: 'PHƯƠNG THỨC GIẢI NGÂN LINH HOẠT',
                        description: 'Cho phép giải ngân khi có giấy hẹn đăng ký xe'
                    },
                    {
                        icon: 'bft_stats-down.svg',
                        header: 'LÃI SUẤT ÁP DỤNG',
                        description: 'VIB liên tục triển khai các gói Lãi suất cho vay ưu đãi, cạnh tranh'
                    }
                ]
            },
            {
                salesGroup: 'business_new_auto',
                tabs: ['compare', 'promotion','method', 'conditions'],
                likeid: 'null',
                items: [
                    {
                        icon: 'bft_car.svg',
                        header: 'MỨC CHO VAY CAO',
                        description: 'Tối đa trên giá trị mua : 80%'
                    },
                    {
                        icon: 'bft_calendar-time.svg',
                        header: 'THỜI GIAN VAY VỐN DÀI',
                        description: 'Thời gian cho vay tối đa 7 năm'
                    },
                    {
                        icon: 'bft_atm.svg',
                        header: 'PHƯƠNG THỨC GIẢI NGÂN LINH HOẠT',
                        description: 'Cho phép giải ngân khi có giấy hẹn đăng ký xe'
                    },
                    {
                        icon: 'bft_stats-down.svg',
                        header: 'LÃI SUẤT ÁP DỤNG',
                        description: 'VIB liên tục triển khai các gói Lãi suất cho vay ưu đãi, cạnh tranh'
                    }
                ]
            },
            {
                salesGroup: 'business_used_auto',
                tabs: ['compare', 'promotion','method', 'conditions'],
                likeid:'null',
                items: [
                    {
                        icon: 'bft_car.svg',
                        header: 'MỨC CHO VAY CAO',
                        description: 'Tối đa trên giá trị mua : 80%'
                    },
                    {
                        icon: 'bft_calendar-time.svg',
                        header: 'THỜI GIAN VAY VỐN DÀI',
                        description: 'Thời gian cho vay tối đa 5 năm'
                    },
                    {
                        icon: 'bft_atm.svg',
                        header: 'PHƯƠNG THỨC GIẢI NGÂN LINH HOẠT',
                        description: 'Cho phép giải ngân khi có giấy hẹn đăng ký xe'
                    },
                    {
                        icon: 'bft_stats-down.svg',
                        header: 'LÃI SUẤT ÁP DỤNG',
                        description: 'VIB liên tục triển khai các gói Lãi suất cho vay ưu đãi, cạnh tranh'
                    }
                ]
            }
        ],
        category: ProductCategory.LENDING
    },
    {
        product: PERSONAL_LOANS,
        icon: 'prd_personal-loans.svg',
        salesGroups: [
            {
                salesGroup: 'overseas_study',
                tabs: ['compare', 'promotion','method', 'conditions'],
                likeid:'null',
                items: [
                    {
                        icon: 'bft_student.svg',
                        header: 'Số tiền cho vay cao',
                        description: 'Lên đến 100% học phí và sinh hoạt phí đối với du học nước ngoài, đến 80% học phí với học tập trong nước'
                    },
                    {
                        icon: 'bft_calendar-time.svg',
                        header: 'Thời hạn cho vay dài',
                        description: 'Thời hạn vay lên đến 10 năm'
                    },
                    {
                        icon: 'bft_atm.svg',
                        header: 'Phương thức trả nợ vay linh hoạt',
                        description: 'Trả gốc hàng tháng, hàng quý hoặc 6 tháng/lần và trả lãi hàng tháng; Số tiền trả từng lần linh hoạt tùy thuộc khả năng tài chính của khách hàng'
                    },
                    {
                        icon: 'bft_stats-down.svg',
                        header: 'Lãi suất cho vay ưu đãi',
                        description: 'VIB liên tục triển khai các gói lãi suất cho vay ưu đãi, cạnh tranh'
                    }
                ]
            },
            {
                salesGroup: 'personal_overdraft',
                tabs: [ 'compare', 'promotion','method', 'conditions'],
                likeid:'null',
                items: [
                    {
                        icon: 'bft_stats-down.svg',
                        header: 'Lãi suất, Phí cạnh tranh',
                        description: 'Tiền lãi được tính theo số tiền  và số ngày thấu chi thực tế'
                    },
                    {
                        icon: 'bft_calendar-time.svg',
                        header: 'Thời gian vay vốn dài',
                        description: 'Thời gian cho vay tối đa 12 tháng'
                    },
                    {
                        icon: 'bft_performance.svg',
                        header: 'Mức cho vay cao',
                        description: 'Hạn mức  lên tới 300 triệu đồng'
                    },
                    {
                        icon: 'bft_washing.svg',
                        header: 'Mục dích vay đa dạng',
                        description: 'Phục vụ nhu cầu tiêu dùng của cá nhân và gia đình khách hàng'
                    }
                ]
            },
            {
                salesGroup: 'loan_secured_savings',
                tabs: [ 'compare', 'promotion','method', 'conditions'],
                likeid:'null',
                items: [
                    {
                        icon: 'bft_stats-down.svg',
                        header: 'Lãi suất, Phí',
                        description: 'Lãi suất ưu đãi, không phí phạt trả nợ trước hạn'
                    },
                    {
                        icon: 'bft_calendar-time.svg',
                        header: 'Thời gian vay vốn',
                        description: 'Lên đến 12 tháng'
                    },
                    {
                        icon: 'bft_cert.svg',
                        header: 'Mức cho vay',
                        description: 'Cho vay lên đến 100% giá trị giấy tờ có giá tính tại thời điểm đáo hạn khoản vay'
                    },
                    {
                        icon: 'bft_list.svg',
                        header: 'Hồ sơ vay đơn giản',
                        description: 'Hồ sơ vay đơn giản'
                    }
                ]
            },
            {
                salesGroup: 'other',
                tabs: ['compare', 'promotion','method', 'conditions'],
                likeid :'null',
                items: [
                    {
                        icon: 'bft_washing.svg',
                        header: 'Mục đích vay đa dạng',
                        description: 'Có thể vay phục vụ nhu cầu tiêu dùng cho bản thân, bố mẹ, con ruột'
                    },
                    {
                        icon: 'bft_performance.svg',
                        header: 'Mức cho vay cao',
                        description: 'Cho vay tiêu dùng cá nhân lên đến 70% nhu cầu vốn, tối đa 1 tỷ đồng'
                    },
                    {
                        icon: 'bft_calendar-time.svg',
                        header: 'Thời gian vay vốn dài',
                        description: 'Thời hạn vay lên đến 6 năm'
                    },
                    {
                        icon: 'bft_stats-down.svg',
                        header: 'Lãi suất cho vay ưu đãi',
                        description: 'VIB liên tục triển khai các gói Lãi suất cho vay ưu đãi, cạnh tranh'
                    }
                ]
            }
        ],
        category: ProductCategory.LENDING
    },
    {
        product: 'current_account',
        icon: 'prd_current-account.svg',
        salesGroups: [
            {
                salesGroup: 'current_account',
                tabs: ['features', 'faq'],
                likeid: 'null',
                items: [
                    {
                        header: 'Phí quản lý tài khoản',
                        description: 'Miễn phí 3 tháng đầu, từ tháng thứ 4 miễn phí nếu số dư bình quân TK tháng tính phí từ 200.000 đồng trở lên',
                        icon: 'bft_shopping.svg'
                    },
                    {
                        header: 'Rút tiền , chuyển tiền linh hoạt',
                        description: 'Miễn phí rút tiền nội mạng. Miễn phí rút tiền với thẻ thanh toán nội địa VIB Values hơn 15.700 ATM NH nội địa khác nếu SDBQ TK tháng trước từ 5 triệu trở lên',
                        icon: 'bft_atm.svg'
                    },
                    {
                        header: 'Thanh toán hoá đơn dễ dàng',
                        description: 'Miễn phí thanh toán hoá đơn: điện, nước, viễn thông…. và nhiều ưu đãi hoàn tiền hấp dẫn',
                        icon: 'bft_document.svg'
                    },
                    {
                        header: 'Nhân viên VIB hỗ trợ tận nơi',
                        description: 'Chỉ với 3 phút điền thông tin trên website, nhân viên VIB sẽ đến tận nơi hỗ trợ bạn mở TK',
                        icon: 'bft_scooter.svg'
                    }
                ]
            }
        ],
        category: ProductCategory.CURRENT
    },
    {
        product: 'credit_cards',
        icon: 'prd_credit-cards.svg',
        salesGroups: [
            {
                salesGroup: PLATINUM_DOUBLE_CASH_BACK,
                
                tabs: ['features', 'requirements',  'card_comparison', 'fees', 'promotion','compare'],
                likeid: 'null',
                items: [
                    {
                        header: 'Hoàn tiền 2 lần',
                        description: 'Hoàn 0,5% giá trị tất cả giao dịch thanh toán thẻ trong kỳ và hoàn 0,5% khi bạn thanh toán dư nợ. Đặc biệt, hoàn thêm 0,5% trên tất cả giao dịch tại nước ngoài và các giao dịch rút/ứng tiền mặt. Quy trình hoàn tiền đơn giản. Số Tiền hoàn lại tối thiểu để quy đổi là 500.000 VND',
                        icon: 'bft_gift.svg'
                    },
                    {
                        header: 'Trả góp lãi suất 0%',
                        description: 'Đơn giản và dễ dàng sở hữu sản phẩm hay kỳ nghỉ bạn mơ ước với chương trình Mua hàng Trả góp dành cho chủ thẻ tín dụng VIB',
                        icon: 'bft_shopping.svg'
                    },
                    {
                        header: 'Miễn lãi lên đến 55 ngày',
                        description: 'Mua sắm ngay, trả sau với thời gian miễn lãi lên đến 55 ngày',
                        icon: 'bft_calendar-time.svg'
                    },
                    {
                        header: 'Tận hưởng ưu đãi từ VIB World',
                        description: 'Tận hưởng ưu đãi đến 70% tại hơn 300 đối tác ăn uống, mua sắm, du lịch trên toàn thế giới',
                        icon: 'bft_vib-world.svg'
                    }
                ]
            },
            {
                salesGroup: GOLD_CREDIT_CARD,
                tabs: ['features', 'requirements',  'card_comparison', 'fees', 'promotion','compare'],
                likeid:'null',
                items: [
                    {
                        header: 'Hoàn tiền cho mọi giao dịch',
                        description: 'Hoàn tiền 0,5% giá trị tất cả giao dịch thẻ bao gồm giao dịch thanh toán và rút tiền mặt *',
                        icon: 'bft_gift.svg'
                    },
                    {
                        header: 'Tận hưởng ưu đãi từ VIB World',
                        description: 'Tận hưởng ưu đãi đến 70% tại hơn 300 đối tác ăn uống, mua sắm, du lịch trên toàn thế giới',
                        icon: 'bft_vib-world.svg'
                    },
                    {
                        header: 'Hoàn phí thường niên năm đầu',
                        description: 'Miễn phí năm đầu nếu phát sinh giao dịch trong vòng 30 ngày từ ngày phát hành',
                        icon: 'bft_shopping.svg'
                    },
                    {
                        header: 'Trả góp lãi suất 0%',
                        description: 'Đơn giản và dễ dàng sở hữu sản phẩm hay kỳ nghỉ bạn mơ ước với chương trình Mua hàng Trả góp dành cho chủ thẻ tín dụng VIB',
                        icon: 'bft_stats-down.svg'
                    }
                ]
            },
            {
                salesGroup: 'classic_credit_card',
                tabs: ['features', 'requirements',  'card_comparison', 'fees', 'promotion','compare'],
                likeid: 'null',
                items: [
                    {
                        header: 'Miễn phí thường niên',
                        description: 'Miễn phí năm đầu nếu phát sinh giao dịch trong vòng 30 ngày từ ngày phát hành. Miễn phí các năm tiếp theo trong trường hợp tổng số lần giao dịch chi tiêu/rút tiền năm liền trước đạt 6 giao dịch',
                        icon: 'bft_shopping.svg'
                    },
                    {
                        header: 'Tặng điểm thưởng cho từng giao dịch',
                        description: 'Với mỗi 1.000đ chi tiêu bằng thẻ, bạn sẽ được tặng 1 điểm thưởng. Tích diểm và đổi quà yêu thích từ mua sắm, ăn uống, du lịch, làm đẹp hay giải trí',
                        icon: 'bft_gift.svg'
                    },
                    {
                        header: 'Tận hưởng ưu đãi từ VIB World',
                        description: 'Tận hưởng ưu đãi đến 70% tại hơn 300 đối tác ăn uống, mua sắm, du lịch trên toàn thế giới',
                        icon: 'bft_vib-world.svg'
                    },
                    {
                        header: 'Trả góp lãi suất 0%',
                        description: 'Đơn giản và dễ dàng sở hữu sản phẩm hay kỳ nghỉ bạn mơ ước với chương trình Mua hàng Trả góp dành cho chủ thẻ tín dụng VIB',
                        icon: 'bft_stats-down.svg'
                    }
                ]
            }
        ],
        category: ProductCategory.CREDIT
    },
    {
        product: 'prepaid_master_card',
        icon: 'prd_prepaid-card.svg',
        salesGroups: [
            {
                salesGroup: 'prepaid_card',
                tabs: ['features', 'requirements', 'fees'],
                likeid:'null',
                items: [
                    {
                        header: 'Dễ dàng sở hữu thẻ VIB Prepaid',
                        description: 'Không cần mở tài khoản ngân hàng',
                        icon: 'bft_card.svg'
                    },
                    {
                        header: 'Mạng lưới giao dịch rộng rãi',
                        description: 'Được chấp nhận thanh toán trên 35 triệu điểm chấp nhận thẻ và 1,9 triệu ATM trên toàn thế giới và dễ dàng thanh toán trực tuyến',
                        icon: 'bft_network.svg'
                    },
                    {
                        header: 'Tận hưởng ưu đãi từ VIB World',
                        description: 'Tận hưởng ưu đãi đến 70% tại hơn 300 đối tác ăn uống, mua sắm, du lịch trên toàn thế giới',
                        icon: 'bft_vib-world.svg'
                    },
                    {
                        header: 'Tiện lợi khi sử dụng',
                        description: 'Nạp và tái nạp tiền thuận tiện để tiếp tục sử dụng',
                        icon: 'bft_atm.svg'
                    }
                ]
            }
        ],
        category: ProductCategory.CURRENT
    },
    {
        product: 'saving_account',
        icon: 'prd_savings-account.svg',
        salesGroups: [
            {
                salesGroup: PROGRESSIVE_SAVER,
                tabs: ['features', 'compare', 'promotion', 'faq'],
                likeid:'null',
                items: [
                    {
                        header: 'Lãi suất tăng theo mức tiền gửi',
                        description: 'Mức lãi suất tăng thêm theo từng mức tiền gửi và kỳ hạn gửi tiết kiệm',
                        icon: 'bft_stats-up.svg'
                    },
                    {
                        header: 'Kỳ hạn gửi tiền đa dạng',
                        description: 'Kỳ hạn gửi tiền tiết kiệm đa dạng từ 1 tuần tới 36 tháng',
                        icon: 'bft_calendar-time.svg'
                    },
                    {
                        header: 'Rút gốc bất kỳ lúc nào',
                        description: 'Được tất toán toàn bộ sổ tiết kiệm trước hạn theo quy định của VIB và được hưởng mức lãi suất không kỳ hạn',
                        icon: 'bft_atm.svg'
                    },
                    {
                        header: 'Thường xuyên có chương trình khuyến mại',
                        description: 'Thường xuyên có chương trình khuyến mại với quà tặng ngay hấp dẫn và giải thưởng lớn cuối chương trình',
                        icon: 'bft_gift.svg'
                    }
                ]
            },
            {
                salesGroup: TERM_DEPOSIT,
                tabs: ['features', 'compare', 'promotion', 'faq'],
                likeid:'null',
                items: [
                    {
                        header: 'Lãi suất tiết kiệm hấp dẫn',
                        description: 'Lãi suất tiền gửi tiết kiệm có kỳ hạn hấp dẫn trong suốt thời gian gửi tiền',
                        icon: 'bft_stats-up.svg'
                    },
                    {
                        header: 'Loại tiền gửi đa dạng',
                        description: 'Kỳ hạn gửi tiền tiết kiệm đa dạng từ 1 tuần tới 36 tháng',
                        icon: 'bft_currency.svg'
                    },
                    {
                        header: 'Kỳ hạn gửi tiền linh hoạt',
                        description: 'Định kỳ lĩnh lãi linh hoạt: định kỳ, cuối kỳ',
                        icon: 'bft_calendar-time.svg'
                    },
                    {
                        header: 'Gửi trực tuyến đơn giản, nhanh chóng',
                        description: 'Mở tài khoản tiền gửi tiết kiệm có kỳ hạn trực tuyến một cách đơn giản và nhanh chóng',
                        icon: 'bft_internet.svg'
                    }
                ]
            },
            /*{
                salesGroup: ONLINE_TERM_DEPOSIT,
                tabs: ['features', 'compare', 'promotion', 'faq'],
                items: [
                    {
                        header: 'Lãi suất tiết kiệm hấp dẫn',
                        description: 'Lãi suất tiền gửi tiết kiệm có kỳ hạn hấp dẫn trong suốt thời gian gửi tiền',
                        icon: 'bft_stats-up.svg'
                    },
                    {
                        header: 'Loại tiền gửi đa dạng',
                        description: 'Kỳ hạn gửi tiền tiết kiệm đa dạng từ 1 tuần tới 36 tháng',
                        icon: 'bft_currency.svg'
                    },
                    {
                        header: 'Kỳ hạn gửi tiền linh hoạt',
                        description: 'Định kỳ lĩnh lãi linh hoạt: định kỳ, cuối kỳ',
                        icon: 'bft_calendar-time.svg'
                    },
                    {
                        header: 'Gửi trực tuyến đơn giản, nhanh chóng',
                        description: 'Mở tài khoản tiền gửi tiết kiệm có kỳ hạn trực tuyến một cách đơn giản và nhanh chóng',
                        icon: 'bft_internet.svg'
                    }
                ]
            },*/
            {
                salesGroup: FLEXIBLE_DEPOSIT,
                tabs: ['features', 'compare', 'promotion', 'faq'],
                likeid:'null',
                items: [
                    {
                        header: 'Lãi suất tiền gửi hấp dẫn',
                        description: 'Lãi suất cao hơn lãi suất tiền gửi không kỳ hạn của tài khoản thanh toán',
                        icon: 'bft_stats-up.svg'
                    },
                    {
                        header: 'Giao dịch thuận tiện',
                        description: 'Giao dịch 24/7 - dễ dàng chuyển tiền mọi lúc, mọi nơi',
                        icon: 'bft_currency.svg'
                    },
                    {
                        header: 'Đảm bảo nhu cầu thanh toán  linh hoạt',
                        description: 'Kết nối online 2 chiều với tài khoản tiền gửi thanh toán nhằm đảm bảo nhu cầu thanh toán linh hoạt của bạn mọi lúc mọi nơi',
                        icon: 'bft_calendar-time.svg'
                    },
                    {
                        header: 'Số dư tối thiểu bằng 0',
                        description: 'Không cần duy trì số dư tối thiểu, chuyển tiền miễn phí từ tài khoản thanh toán sang tài khoản E-Savings và ngược lại, miễn phí mở và phí duy trì tài khoản E-Savings',
                        icon: 'bft_internet.svg'
                    }
                ]
            },
            {
                salesGroup: FLEXIBLE_SAVINGS_ACCOUNT,
                tabs: ['features', 'compare', 'promotion', 'faq'],
                likeid:'null',
                items: [
                    {
                        header: 'Lãi suất hấp dẫn, linh hoạt',
                        description: 'Lãi suất tiền gửi tiết kiệm có kỳ hạn hấp dẫn tự động thay đổi theo lãi suất thị trường',
                        icon: 'bft_stats-up.svg'
                    },
                    {
                        header: 'Kênh giao dịch thuận tiện, dễ dàng',
                        description: 'Kênh giao dịch thuận tiện, dễ dàng',
                        icon: 'bft_stopwatch.svg'
                    },
                    {
                        header: 'Không giới hạn số lần, số tiền gửi',
                        description: 'Có thể nộp thêm tiền vào tài khoản mà không giới hạn số lần và số tiền gửi',
                        icon: 'bft_atm.svg'
                    },
                    {
                        header: 'Gửi trực tuyến đơn giản và nhanh chóng',
                        description: 'Mở tài khoản tiền gửi tiết kiệm linh hoạt trực tuyến một cách đơn giản và nhanh chóng',
                        icon: 'bft_internet.svg'
                    }
                ]
            },
            {
                salesGroup: NON_TERM_SAVINGS_ACCOUNT,
                tabs: ['features', 'compare', 'promotion', 'faq'],
                likeid:'null',
                items: [
                    {
                        header: 'Lãi suất tiền gửi hấp dẫn',
                        description: 'Lãi suất cao hơn lãi suất tiền gửi không kỳ hạn của tài khoản thanh toán',
                        icon: 'bft_stats-up.svg'
                    },
                    {
                        header: 'Giao dịch thuận tiện',
                        description: 'Giao dịch 24/7 - dễ dàng chuyển tiền mọi lúc, mọi nơi',
                        icon: 'bft_currency.svg'
                    },
                    {
                        header: 'Đảm bảo nhu cầu thanh toán  linh hoạt',
                        description: 'Kết nối online 2 chiều với tài khoản tiền gửi thanh toán nhằm đảm bảo nhu cầu thanh toán linh hoạt của bạn mọi lúc mọi nơi',
                        icon: 'bft_calendar-time.svg'
                    },
                    {
                        header: 'Số dư tối thiểu bằng 0',
                        description: 'Không cần duy trì số dư tối thiểu, chuyển tiền miễn phí từ tài khoản thanh toán sang tài khoản E-Savings và ngược lại, miễn phí mở và phí duy trì tài khoản E-Savings',
                        icon: 'bft_internet.svg'
                    }
                ]
            }
            /*,{
                salesGroup: ONLINE_FLEXIBLE_SAVINGS_ACCOUNT,
                tabs: ['features', 'compare', 'promotion', 'faq'],
                items: [
                    {
                        header: 'Lãi suất tiền gửi hấp dẫn',
                        description: 'Lãi suất cao hơn lãi suất tiền gửi không kỳ hạn của tài khoản thanh toán',
                        icon: 'bft_stats-up.svg'
                    },
                    {
                        header: 'Giao dịch thuận tiện',
                        description: 'Giao dịch 24/7 - dễ dàng chuyển tiền mọi lúc, mọi nơi',
                        icon: 'bft_currency.svg'
                    },
                    {
                        header: 'Đảm bảo nhu cầu thanh toán  linh hoạt',
                        description: 'Kết nối online 2 chiều với tài khoản tiền gửi thanh toán nhằm đảm bảo nhu cầu thanh toán linh hoạt của bạn mọi lúc mọi nơi',
                        icon: 'bft_calendar-time.svg'
                    },
                    {
                        header: 'Số dư tối thiểu bằng 0',
                        description: 'Không cần duy trì số dư tối thiểu, chuyển tiền miễn phí từ tài khoản thanh toán sang tài khoản E-Savings và ngược lại, miễn phí mở và phí duy trì tài khoản E-Savings',
                        icon: 'bft_internet.svg'
                    }
                ]
            }*/
        ],
        category: ProductCategory.SAVING
    },
    {
        product: 'digital_banking',
        icon: 'prd_digital-banking.svg',
        salesGroups: [
            {
                salesGroup: 'mobile_banking',
                tabs: ['features', 'download'],
                likeid:'null',
                items: [
                    {
                        header: 'Thuận tiện mọi lúc mọi nơi',
                        description: 'Bạn có thể sử dụng ứng dụng MyVIB ở bất cứ nơi nào',
                        icon: 'bft_mobile-24.svg'
                    },
                    {
                        header: 'An toàn với cơ chế bảo mật kép',
                        description: '100% giao dịch được đảm bảo an toàn tuyệt đối',
                        icon: 'bft_mobile-pass.svg'
                    },
                    {
                        header: 'Sử dụng mã PIN cá nhân',
                        description: 'Tự cài đặt mã PIN của riêng mình để truy cập vào ứng dụng',
                        icon: 'bft_mobile-user.svg'
                    },
                    {
                        header: 'Tính năng vượt trội, miễn phí',
                        description: 'Nhiều tính năng tiện ích, dễ sử dụng và hoàn toàn miễn phí',
                        icon: 'bft_stats-down.svg'
                    }
                ]
            },
            {
                salesGroup: 'internet_banking',
                tabs: ['features', 'fees'],
                likeid :'null',
                items: [
                    {
                        header: 'Đơn giản, dễ sử dụng',
                        description: 'Thao tác thực hiện đơn giản, thân thiện với khách hàng',
                        icon: 'bft_desktop-click.svg'
                    },
                    {
                        header: 'Tính năng vượt trội',
                        description: 'Nhiều tính năng tiện ích, dễ sử dụng và hoàn toàn miễn phí',
                        icon: 'bft_desktop-list.svg'
                    },
                    {
                        header: 'Thuận tiện mọi lúc mọi nơi',
                        description: 'Khách hàng có thể sử dụng bất cứ nơi nào , 24/7',
                        icon: 'bft_desktop-24.svg'
                    },
                    {
                        header: 'An toàn với cơ chế bảo mật kép',
                        description: '100% giao dịch được đảm bảo an toàn tuyệt đối',
                        icon: 'bft_desktop-pass.svg'
                    }
                ]
            },
            {
                salesGroup: 'sms_banking',
                tabs: ['features', 'user_guide'],
                likeid:'null',
                items: [
                    {
                        header: 'Chủ động quản lý tài khoản',
                        description: 'Được cập nhật thông báo biến động số dư tài khoản kịp thời',
                        icon: 'bft_mobile-stats.svg'
                    },
                    {
                        header: 'Thao tác đơn giản, dễ sử dụng',
                        description: 'Có thể nhắn tin để truy vấn thông tin khi cần thiết',
                        icon: 'bft_mobile-click.svg'
                    },
                    {
                        header: 'Nạp tiền điện thoại qua SMS',
                        description: 'Nhắn tin để nạp thẻ điện thoại khi cần, mọi lúc mọi nơi',
                        icon: 'bft_mobile-24.svg'
                    }
                ]
            },
            {
                salesGroup: 'mobile_bankplus',
                tabs: ['features'],
                likeid: 'null',
                items: [
                    {
                        header: 'Nhiều tính năng tiện ích, vượt trội',
                        description: 'Chuyển tiền, nạp tiền, thanh toán hóa đơn, quản lý tài khoản',
                        icon: 'bft_mobile-list.svg'
                    },
                    {
                        header: 'Sử dụng cho dòng điện thoại cơ bản',
                        description: 'Sử dụng công nghệ USSD cho phép thao tác trên điện thoại cơ bản (không cần là smartphone)',
                        icon: 'bft_mobile-click.svg'
                    },
                    {
                        header: 'Nhiều khuyến mãi hấp dẫn',
                        description: 'Chiết khấu 3% cho các giao dịch nạp tiền, thanh toán hóa đơn',
                        icon: 'bft_gift.svg'
                    }
                ]
            }
        ],
        category: ProductCategory.CURRENT
    },
    {
        product: 'international_debit_card',
        icon: 'prd_int-debit-card.svg',
        salesGroups: [
            {
                salesGroup: PLATINUM_DEBIT_CARD,
                tabs: ['features', 'fees', 'requirements'],
                likeid:'null',
                items: [
                    {
                        header: 'Tiết kiệm đến 6 triệu đồng/ năm',
                        description: 'Hoàn 1% cho giao dịch thanh toán mua vé máy bay, khách sạn, nhà hàng và trung tâm thương mại & hoàn 0.5% cho các giao dịch khác. Hoàn thêm 0.5% cho các giao dịch ở nước ngoài.*',
                        icon: 'bft_gift.svg'
                    },
                    {
                        header: 'Giao dịch toàn cầu',
                        description: 'Được chấp nhận trên 35 triệu điểm mua sắm và 1,9 triệu ATM trên toàn thế giới',
                        icon: 'bft_network.svg'
                    },
                    {
                        header: 'Miễn phí thường niên',
                        description: 'Hoàn toàn miễn phí thường niên năm đâu tiên',
                        icon: 'bft_shopping.svg'
                    },
                    {
                        header: 'Tận hưởng ưu đãi từ VIB World',
                        description: 'Tận hưởng ưu đãi đến 70% tại hơn 300 đối tác ăn uống, mua sắm, du lịch trên toàn thế giới',
                        icon: 'bft_vib-world.svg'
                    }
                ]
            },
            {
                salesGroup: CLASSIC_DEBIT_CARD,
                tabs: ['features', 'fees', 'requirements'],
                likeid :'null',
                items: [
                    {
                        header: 'Miễn phí thường niên',
                        description: 'Hoàn toàn miễn phí thường niên năm đâu tiên',
                        icon: 'bft_shopping.svg'
                    },
                    {
                        header: 'Hoàn đến 5% các giao dịch thanh toán',
                        description: 'Số tiền tích lũy tối thiểu để quy đổi là 50.000 VND. Số tiền sẽ tự động tích lũy và không bao giờ hết hạn trong thời gian sử dụng thẻ. *',
                        icon: 'bft_gift.svg'
                    },
                    {
                        header: 'Giao dịch toàn cầu',
                        description: 'Được chấp nhận trên 35 triệu điểm mua sắm và 1,9 triệu ATM trên toàn thế giới',
                        icon: 'bft_network.svg'
                    },
                    {
                        header: 'Tận hưởng ưu đãi từ VIB World',
                        description: 'Tận hưởng ưu đãi đến 70% tại hơn 300 đối tác ăn uống, mua sắm, du lịch trên toàn thế giới',
                        icon: 'bft_vib-world.svg'
                    }
                ]
            }
        ],
        category: ProductCategory.DEBIT
    },
    {
        product: 'freedom_package',
        icon: 'prd_freedom-package.svg',
        salesGroups: [
            {
                salesGroup: 'freedom_package',
                tabs: ['conditions'],
                likeid:'null',
                items: [
                    {
                        header: 'Ưu đãi về phí',
                        description: 'Miễn phí chuyển tiền qua Internet Banking và MyVIB, phí rút tiền tại các ATM của các ngân hàng nội địa, phí quản lý tài khoản thanh toán; miễn phí phát hành và phí thường niên các sản phẩm trong gói',
                        icon: 'bft_special.svg'
                    },
                    {
                        header: 'Giảm lãi suất khoản vay',
                        description: 'Giảm đến 0,5%/năm lãi suất với các khoản vay bất động sản, vay mua ô tô không quá 2 tỷ đồng được giải ngân trong thời gian hiệu lực của gói',
                        icon: 'bft_stats-down.svg'
                    },
                    {
                        header: 'Tăng lãi suất tiền gửi tiết kiệm',
                        description: 'Cộng thêm đến 0,5%/năm lãi suất với tiền gửi tiết kiệm từ 50 - 500 triệu đồng và có kỳ hạn từ 7 tháng trở lên mở trong thời gian hiệu lực của gói',
                        icon: 'bft_stats-increase.svg'
                    },
                    {
                        header: 'Ưu đãi hoàn tiền',
                        description: 'Hoàn tiền lên đến 5% khi chi tiêu bằng thẻ thanh toán toàn cầu VIB MasterCard Debit',
                        icon: 'bft_card.svg'
                    }
                ]
            }
        ],
        category: ProductCategory.CURRENT
    },
    {
        product: 'payroll_package',
        icon: 'prd_payroll-package.svg',
        salesGroups: [
            {
                salesGroup: 'payroll_package',
                tabs: ['conditions'],
                likeid:'null',
                items: [
                    {
                        header: 'Ưu đãi cho tổ chức trả lương',
                        description: 'Miễn toàn bộ phí trả lương tới người nhận lương có tài khoản thanh toán tại VIB',
                        icon: 'bft_building.svg'
                    },
                    {
                        header: 'Ưu đãi cho CBNV',
                        description: 'Miễn phí chuyển tiền qua Internet Banking và MyVIB, phí rút tiền tại các ATM của ngân hàng nội địa và phí quản lý tài khoản thanh toán; miễn phí phát hành và duy trì thẻ; miễn phí nhận tin nhắn thông báo số dư TKTT tự động; cơ hội vay tiêu dùng có tài sản bảo đảm với lãi suất ưu đãi',
                        icon: 'bft_special.svg'
                    }
                ]
            }
        ],
        category: ProductCategory.CURRENT
    },
    {
        product: 'guarantees',
        icon: 'prd_guarantees.svg',
        salesGroups: [
            {
                salesGroup: 'guarantees',
                tabs: ['conditions'],
                likeid:'null',
                items: [
                    {
                        header: 'Thủ tục và phí',
                        description: 'Miễn phí chuyển tiền qua Internet Banking và MyVIB, phí rút tiền tại các ATM của các ngân hàng nội địa, phí quản lý tài khoản thanh toán; miễn phí phát hành và phí thường niên các sản phẩm trong gói',
                        icon: 'bft_special.svg'
                    },
                    {
                        header: 'Giảm lãi suất khoản vay',
                        description: 'Giảm đến 0,5%/năm lãi suất với các khoản vay bất động sản, vay mua ô tô không quá 2 tỷ đồng được giải ngân trong thời gian hiệu lực của gói',
                        icon: 'bft_stats-down.svg'
                    },
                    {
                        header: 'Tăng lãi suất tiền gửi tiết kiệm',
                        description: 'Cộng thêm đến 0,5%/năm lãi suất với tiền gửi tiết kiệm từ 50 - 500 triệu đồng và có kỳ hạn từ 7 tháng trở lên mở trong thời gian hiệu lực của gói',
                        icon: 'bft_stats-up.svg'
                    },
                    {
                        header: 'Ưu đãi hoàn tiền',
                        description: 'Hoàn tiền lên đến 5% khi chi tiêu bằng thẻ thanh toán toàn cầu VIB MasterCard Debit',
                        icon: 'bft_card.svg'
                    }
                ]
            }
        ],
        category: ProductCategory.CURRENT
    },
    {
        product: 'remittance',
        icon: 'contact.svg',
        salesGroups: [
            {
                salesGroup: 'remittance',
                tabs: ['conditions'],
                likeid:'null',
                items: [
                    {
                        header: 'Chuyển tiền trên phạm vi toàn cầu',
                        description: 'Chuyển tiền  trong nước tại mọi thời điểm, ở bất kỳ đâu,  với các tiện ích ngân hàng đa dạng; chuyển tiền quốc tế qua hệ thống ngân hàng đại lý có mạng lưới rộng khắp',
                        icon: 'bft_vib-world.svg'
                    },
                    {
                        header: 'Nhận tiền mọi lúc mọi nơi',
                        description: 'Nhận tiền nhanh qua hệ thống đại lý các công ty chuyển tiền uy tín trên thế giới có liên kết với VIB như: MoneyGram, SMT, Ezremit, RIA Financial Services, Anelik Money Transfer, Contact, Unistream, Bancomer Transfer Services, Xpress; nhận tiền về trong và ngoài nước qua kênh ngân hàng với mạng lưới chi nhánh VIB rộng khắp cả nước',
                        icon: 'bft_atm.svg'
                    }
                ]
            }
        ],
        category: ProductCategory.CURRENT
    },
    {
        product: 'saving_insurance',
        icon: 'prd_insurance-saving.svg',
        salesGroups: [
            {
                salesGroup: 'pru_nurturing_talents',
                tabs: ['conditions', 'promotion'],
                likeid:'null',
                items: [
                    {
                        header: 'Đảm bảo cho con một quỹ học vấn giá trị',
                        description: 'Quyền lợi học vấn tương đương 150% số tiền bảo hiểm là nguồn tài chính đảm bảo kế hoạch học tập cho con',
                        icon: 'bft_student.svg'
                    },
                    {
                        header: 'Phần thưởng đặc biệt cho kết quả học tập xuất sắc',
                        description: '10% số tiền bảo hiểm là phần thưởng tiền mặt đặc biệt nếu con đỗ đại học và nằm trong danh sách các thí sinh có 10 mức điểm đầu vào cao nhất của Ngành học thuộc trường đại học đã tham gia xét tuyển',
                        icon: 'bft_gift.svg'
                    },
                    {
                        header: 'Quyền lợi bảo vệ đa dạng',
                        description: 'Chi trả lên đến 150% số tiền bảo hiểm nếu sự kiện bảo hiểm xảy ra với người được bảo hiểm',
                        icon: 'bft_shield.svg'
                    },
                    {
                        header: 'Gia tăng bảo vệ',
                        description: 'Sản phẩm bảo hiểm bổ trợ đa dạng với mức phí thấp nhằm mang đến sự hỗ trợ tài chính cho cả gia đình trước những rủi ro khác như tai nạn, bệnh hiểm nghèo…',
                        icon: 'bft_family.svg'
                    }
                ]
            }
        ],
        category: ProductCategory.CURRENT
    },
    {
        product: 'protection_insurance',
        icon: 'prd_insurance-protect.svg',
        salesGroups: [
            {
                salesGroup: 'pru_credit_shield',
                tabs: ['conditions', 'promotion'],
                likeid:'null',
                items: [
                    {
                        header: 'Hỗ trợ tài chính nhiều lần trước rủi ro bệnh hiểm nghèo',
                        description: 'Tổng quyền lợi bảo hiểm bệnh hiểm nghèo lên đến 240% số tiền bảo hiểm cộng các khoản lãi',
                        icon: 'bft_disabled.svg'
                    },
                    {
                        header: 'Hỗ trợ tài chính cho gia đình trước rủi ro tử vong',
                        description: 'Chi trả tối đa 200% số tiền bảo hiểm cùng toàn bộ khỏan lãi đối với rủi ro tử vong',
                        icon: 'bft_bed.svg'
                    },
                    {
                        header: 'Quỹ tiết kiệm khi về hưu',
                        description: 'Chi trả tối đa 200% số tiền bảo hiểm cùng toàn bộ khỏan lãi đối với rủi ro tử vong',
                        icon: 'bft_chair.svg'
                    },
                    {
                        header: 'Bảo vệ lâu dài và cho cả gia đình',
                        description: 'Thời gian bảo hiểm dài lên đến 75 tuổi. Nhiều sản phẩm bổ trợ đa dạng giúp hỗ trợ tài chính cho cả gia đình trong cùng một hợp đồng',
                        icon: 'bft_family.svg'
                    }
                ]
            },
            {
                salesGroup: 'pru_multiple_card',
                tabs: ['conditions', 'promotion'],
                likeid:'null',
                items: [
                    {
                        header: 'Đảm bảo thanh toán dư nợ vay còn lại',
                        description: 'Thanh toán 100% dư nợ gốc còn lại và lãi phát sinh kể từ ngày trả lãi và gốc gần nhất, nếu sự kiện bảo hiểm xảy ra',
                        icon: 'bft_special.svg'
                    },
                    {
                        header: 'Phù hợp khả năng tài chính',
                        description: 'Đóng phí định kỳ  phù hợp với khả năng tài chính của khách hàng',
                        icon: 'bft_wallet.svg'
                    },
                    {
                        header: 'Đơn giản',
                        description: 'Thẩm định đơn giản và nhanh chóng',
                        icon: 'bft_watch-fast.svg'
                    },
                    {
                        header: 'Linh hoạt',
                        description: 'Điều kiện tham gia linh hoạt và dễ dàng',
                        icon: 'bft_atm.svg'
                    }
                ]
            }
        ],
        category: ProductCategory.CURRENT
    },
    {
        product: 'investment_insurance',
        icon: 'prd_insurance-invest.svg',
        salesGroups: [
            {
                salesGroup: 'pru_flexi_care',
                tabs: ['conditions', 'promotion'],
                likeid:'null',
                items: [
                    {
                        header: 'Tiết kiệm hiệu quả, an toàn',
                        description: 'Lãi thực tế từ kết quả đầu tư của Quỹ liên kết chung. Lãi suất đảm bảo không thấp hơn 6,5%/năm trong 3 năm đầu. Thưởng duy trì hợp đồng cứ mỗi 5 năm',
                        icon: 'bft_piggy.svg'
                    },
                    {
                        header: 'Bảo vệ an toàn tài chính',
                        description: 'Hỗ trợ tài chính trước rủi ro tử vong/thương tật toàn bộ vĩnh viễn với phí bảo hiểm hợp lý. Miễn thẩm định sức khỏe khi tăng số tiền bảo hiểm vào thời điểm gia tăng gánh nặng tài chính. Nhận trước một khoản tạm ứng không tính lãi nếu người được bảo hiểm mắc bệnh hiểm nghèo giai đoạn cuối',
                        icon: 'bft_umbrella.svg'
                    },
                    {
                        header: 'Linh hoạt thực hiện mục tiêu',
                        description: 'Tích lũy thêm vào mọi thời điểm để hưởng lãi. Rút tiền linh hoạt để thực hiện nhiều kế hoạch. Đóng phí theo khả năng tài chính. Tăng/giảm số tiền bảo hiểm khi nhu cầu bảo vệ thay đổi. Chọn thời điểm kết thúc hợp đồng',
                        icon: 'bft_atm.svg'
                    }
                ]
            }
        ],
        category: ProductCategory.CURRENT
    },
    {
        product: 'value_debit_card',
        icon: 'prd_value-debit.svg',
        salesGroups: [
            {
                salesGroup: 'value_debit_card',
                tabs: ['features', 'requirements', 'fees'],
                likeid:'null',
                items: [
                    {
                        header: 'Miễn phí rút tiền',
                        description: 'Miễn phí rút tiền mặt tại hơn 15.700 ATM tất cả các ngân hàng tại Việt Nam',
                        icon: 'bft_atm.svg'
                    },
                    {
                        header: 'Chủ động quản lý tài khoản của bạn',
                        description: 'Quản lý tài khoản của bạn dễ dàng qua Internet Banking/ ATM',
                        icon: 'bft_laptop-stats.svg'
                    },
                    {
                        header: 'Giao dịch dễ dàng khắp mọi nơi',
                        description: 'Chuyển khoản, thanh toán hóa đơn, nạp tiền điện thoại dễ dàng qua Internet Banking/ ATM/ MyVIB',
                        icon: 'bft_mobile-stats.svg'
                    },
                    {
                        header: 'Tận hưởng ưu đãi từ VIB World',
                        description: 'Tận hưởng ưu đãi đến 70% tại hơn 300 đối tác ăn uống, mua sắm, du lịch trên toàn thế giới',
                        icon: 'bft_vib-world.svg'
                    }
                ]
            }
        ],
        category: ProductCategory.CURRENT
    }
];
