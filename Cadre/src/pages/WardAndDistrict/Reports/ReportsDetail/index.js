import classes from './styles.module.scss';
import SearchBar from '~components/SearchBar';
import {
  faArrowLeft,
  faArrowRight,
  faLocationDot,
  faCircleInfo,
  faAngleUp,
  faAngleDown,
  faAngleLeft,
  faUser,
  faPhone,
  faEnvelope,
  faFlag,
  faFile,
  faHourglassStart,
  faCheck,
  faDiagramProject,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { IconTextBtn } from '~components/button';

export default function ReportsDetail() {
  const [data, setData] = useState([
    {
      username: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'nva@gmail.com',
      reportedObject: 'Bảng quảng cáo',
      reportType: 'Tố giác sai phạm',
      status: 'Chờ xử lý',
      reportContent:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita veniam temporibus earum et quis aspernatur quia quos provident eos! Magni dolorum a doloribus delectus quae ipsam enim, nam ipsum, nemo consectetur modi autem tempora incidunt quia nihil sint voluptate molestiae saepe consequatur hic! Repudiandae, ad unde! Voluptatibus facilis eum animi ex voluptates ad impedit dicta quisquam ratione corporis, earum similique harum velit! Dolore repellat minima expedita delectus ipsa dignissimos, molestias reiciendis iste rerum minus recusandae voluptatum unde, doloribus, sed sapiente quia. Reprehenderit alias molestiae cumque sit dolores impedit reiciendis, pariatur architecto doloremque quos officia blanditiis. Quaerat similique magnam ab! Numquam, omnis architecto quo nihil rem ipsum iusto totam minus, vitae adipisci reiciendis dolor doloribus enim, ex odit necessitatibus quae commodi perferendis. Possimus incidunt doloremque quos officiis sint quam! Magni commodi saepe id nobis cupiditate, veritatis repudiandae nihil iure quidem ex consequuntur! Exercitationem quibusdam suscipit non placeat dolor excepturi dignissimos temporibus, eveniet vitae ipsum impedit voluptates rem perferendis quis voluptatibus consequuntur sunt sed quasi reiciendis ullam officiis deserunt modi vel iure. Unde alias, dolore architecto expedita doloremque et fugit similique asperiores sint nobis qui recusandae cumque nulla non porro numquam quis dolores magnam nihil. Officiis nihil in et, inventore blanditiis magnam illum odit quibusdam culpa aliquam impedit vero vel nemo, facilis soluta, vitae ut excepturi ipsum aperiam qui deserunt architecto saepe rerum! Aliquam, id iusto cumque odio excepturi fugiat maxime ex voluptatibus quis animi nemo ducimus sequi! Odio quas eveniet nulla! Quasi, facilis voluptas minima voluptatum nam sapiente explicabo error consectetur beatae et numquam cupiditate quos, perspiciatis quam nesciunt nostrum at dolores ullam voluptates rem excepturi necessitatibus mollitia! Perferendis, perspiciatis est officiis, labore natus sapiente molestiae animi illo distinctio magnam totam ipsa minima voluptatem ullam ut magni qui recusandae fugit mollitia corrupti, quasi enim aliquam omnis quibusdam. Libero, amet. Dolores quod repudiandae corporis perspiciatis earum consequatur, explicabo distinctio odio, ad totam debitis repellendus impedit fuga nihil porro mollitia, quia esse ullam adipisci similique soluta illo incidunt ratione! Qui, pariatur natus laudantium aspernatur nostrum, aliquam est minus in deleniti autem, cupiditate molestiae! Consequuntur unde ullam autem quia illo sint, dicta sunt nostrum quas doloribus! Quo dignissimos ratione reiciendis ex laboriosam? Repellendus, reiciendis nobis ab similique tempore eligendi totam voluptate quisquam deleniti vel expedita, accusamus dolor esse reprehenderit consectetur dignissimos deserunt sint est cupiditate, quidem voluptatem. Omnis harum labore laboriosam modi, dignissimos voluptas minima blanditiis maxime, quaerat illo laudantium ipsum hic temporibus consectetur incidunt, iure dicta dolor ullam. Illum modi, nihil mollitia aspernatur facere sint aliquid fugit, asperiores dolores hic minima omnis vitae. Facilis ducimus, tempore explicabo ea sequi fugit eaque perferendis tempora illum asperiores repellat deleniti distinctio dolorem natus nostrum aut amet ipsa molestias eligendi aspernatur aliquid alias rerum quod nobis! Autem laudantium blanditiis rem repellendus cum atque repellat totam vitae sed, necessitatibus dignissimos soluta maiores recusandae corrupti voluptate vel! Cupiditate id, illo eius beatae, quasi voluptatum esse repellendus deserunt sint dicta unde. Consectetur dolor nisi expedita, fugiat quasi blanditiis quaerat vitae quo exercitationem a tenetur nulla voluptatibus, nobis ratione cupiditate eum?',
    },
    {
      username: 'Trần Văn B',
      phone: '0987654321',
      email: 'tvb@gmail.com',
      reportedObject: 'Địa điểm',
      reportType: 'Tố giác sai phạm',
      status: 'Đang xử lý',
      reportContent:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda nostrum dicta distinctio harum non quod natus ipsum ducimus, aliquid enim, nobis labore sapiente ut architecto rerum explicabo culpa nam amet soluta exercitationem! Beatae hic alias quis aliquid ex eligendi vel natus, eveniet ullam possimus, necessitatibus, reiciendis earum dolor? Necessitatibus, ullam.',
    },
    {
      username: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'nva@gmail.com',
      reportedObject: 'Bảng quảng cáo',
      reportType: 'Tố giác sai phạm',
      status: 'Đã xử lý',
      reportContent:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid quidem nobis, modi ducimus impedit itaque facilis nihil enim molestias possimus officiis aspernatur aperiam quam voluptatem nam quos dignissimos voluptate expedita.',
    },
    {
      username: 'Trần Văn B',
      phone: '0987654321',
      email: 'tvb@gmail.com',
      reportedObject: 'Địa điểm',
      reportType: 'Tố giác sai phạm',
      status: 'Không được chấp nhận',
      reportContent:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda nostrum dicta distinctio harum non quod natus ipsum ducimus, aliquid enim, nobis labore sapiente ut architecto rerum explicabo culpa nam amet soluta exercitationem! Beatae hic alias quis aliquid ex eligendi vel natus, eveniet ullam possimus, necessitatibus, reiciendis earum dolor? Necessitatibus, ullam.',
    },
    {
      username: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'nva@gmail.com',
      reportedObject: 'Bảng quảng cáo',
      reportType: 'Tố giác sai phạm',
      status: 'Chờ xử lý',
      reportContent:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita veniam temporibus earum et quis aspernatur quia quos provident eos! Magni dolorum a doloribus delectus quae ipsam enim, nam ipsum, nemo consectetur modi autem tempora incidunt quia nihil sint voluptate molestiae saepe consequatur hic! Repudiandae, ad unde! Voluptatibus facilis eum animi ex voluptates ad impedit dicta quisquam ratione corporis, earum similique harum velit! Dolore repellat minima expedita delectus ipsa dignissimos, molestias reiciendis iste rerum minus recusandae voluptatum unde, doloribus, sed sapiente quia. Reprehenderit alias molestiae cumque sit dolores impedit reiciendis, pariatur architecto doloremque quos officia blanditiis. Quaerat similique magnam ab! Numquam, omnis architecto quo nihil rem ipsum iusto totam minus, vitae adipisci reiciendis dolor doloribus enim, ex odit necessitatibus quae commodi perferendis. Possimus incidunt doloremque quos officiis sint quam! Magni commodi saepe id nobis cupiditate, veritatis repudiandae nihil iure quidem ex consequuntur! Exercitationem quibusdam suscipit non placeat dolor excepturi dignissimos temporibus, eveniet vitae ipsum impedit voluptates rem perferendis quis voluptatibus consequuntur sunt sed quasi reiciendis ullam officiis deserunt modi vel iure. Unde alias, dolore architecto expedita doloremque et fugit similique asperiores sint nobis qui recusandae cumque nulla non porro numquam quis dolores magnam nihil. Officiis nihil in et, inventore blanditiis magnam illum odit quibusdam culpa aliquam impedit vero vel nemo, facilis soluta, vitae ut excepturi ipsum aperiam qui deserunt architecto saepe rerum! Aliquam, id iusto cumque odio excepturi fugiat maxime ex voluptatibus quis animi nemo ducimus sequi! Odio quas eveniet nulla! Quasi, facilis voluptas minima voluptatum nam sapiente explicabo error consectetur beatae et numquam cupiditate quos, perspiciatis quam nesciunt nostrum at dolores ullam voluptates rem excepturi necessitatibus mollitia! Perferendis, perspiciatis est officiis, labore natus sapiente molestiae animi illo distinctio magnam totam ipsa minima voluptatem ullam ut magni qui recusandae fugit mollitia corrupti, quasi enim aliquam omnis quibusdam. Libero, amet. Dolores quod repudiandae corporis perspiciatis earum consequatur, explicabo distinctio odio, ad totam debitis repellendus impedit fuga nihil porro mollitia, quia esse ullam adipisci similique soluta illo incidunt ratione! Qui, pariatur natus laudantium aspernatur nostrum, aliquam est minus in deleniti autem, cupiditate molestiae! Consequuntur unde ullam autem quia illo sint, dicta sunt nostrum quas doloribus! Quo dignissimos ratione reiciendis ex laboriosam? Repellendus, reiciendis nobis ab similique tempore eligendi totam voluptate quisquam deleniti vel expedita, accusamus dolor esse reprehenderit consectetur dignissimos deserunt sint est cupiditate, quidem voluptatem. Omnis harum labore laboriosam modi, dignissimos voluptas minima blanditiis maxime, quaerat illo laudantium ipsum hic temporibus consectetur incidunt, iure dicta dolor ullam. Illum modi, nihil mollitia aspernatur facere sint aliquid fugit, asperiores dolores hic minima omnis vitae. Facilis ducimus, tempore explicabo ea sequi fugit eaque perferendis tempora illum asperiores repellat deleniti distinctio dolorem natus nostrum aut amet ipsa molestias eligendi aspernatur aliquid alias rerum quod nobis! Autem laudantium blanditiis rem repellendus cum atque repellat totam vitae sed, necessitatibus dignissimos soluta maiores recusandae corrupti voluptate vel! Cupiditate id, illo eius beatae, quasi voluptatum esse repellendus deserunt sint dicta unde. Consectetur dolor nisi expedita, fugiat quasi blanditiis quaerat vitae quo exercitationem a tenetur nulla voluptatibus, nobis ratione cupiditate eum?',
    },
    {
      username: 'Trần Văn B',
      phone: '0987654321',
      email: 'tvb@gmail.com',
      reportedObject: 'Địa điểm',
      reportType: 'Tố giác sai phạm',
      status: 'Đang xử lý',
      reportContent:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda nostrum dicta distinctio harum non quod natus ipsum ducimus, aliquid enim, nobis labore sapiente ut architecto rerum explicabo culpa nam amet soluta exercitationem! Beatae hic alias quis aliquid ex eligendi vel natus, eveniet ullam possimus, necessitatibus, reiciendis earum dolor? Necessitatibus, ullam.',
    },
    {
      username: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'nva@gmail.com',
      reportedObject: 'Bảng quảng cáo',
      reportType: 'Tố giác sai phạm',
      status: 'Đã xử lý',
      reportContent:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid quidem nobis, modi ducimus impedit itaque facilis nihil enim molestias possimus officiis aspernatur aperiam quam voluptatem nam quos dignissimos voluptate expedita.',
    },
    {
      username: 'Trần Văn B',
      phone: '0987654321',
      email: 'tvb@gmail.com',
      reportedObject: 'Địa điểm',
      reportType: 'Tố giác sai phạm',
      status: 'Không được chấp nhận',
      reportContent:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda nostrum dicta distinctio harum non quod natus ipsum ducimus, aliquid enim, nobis labore sapiente ut architecto rerum explicabo culpa nam amet soluta exercitationem! Beatae hic alias quis aliquid ex eligendi vel natus, eveniet ullam possimus, necessitatibus, reiciendis earum dolor? Necessitatibus, ullam.',
    },
    {
      username: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'nva@gmail.com',
      reportedObject: 'Bảng quảng cáo',
      reportType: 'Tố giác sai phạm',
      status: 'Chờ xử lý',
      reportContent:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita veniam temporibus earum et quis aspernatur quia quos provident eos! Magni dolorum a doloribus delectus quae ipsam enim, nam ipsum, nemo consectetur modi autem tempora incidunt quia nihil sint voluptate molestiae saepe consequatur hic! Repudiandae, ad unde! Voluptatibus facilis eum animi ex voluptates ad impedit dicta quisquam ratione corporis, earum similique harum velit! Dolore repellat minima expedita delectus ipsa dignissimos, molestias reiciendis iste rerum minus recusandae voluptatum unde, doloribus, sed sapiente quia. Reprehenderit alias molestiae cumque sit dolores impedit reiciendis, pariatur architecto doloremque quos officia blanditiis. Quaerat similique magnam ab! Numquam, omnis architecto quo nihil rem ipsum iusto totam minus, vitae adipisci reiciendis dolor doloribus enim, ex odit necessitatibus quae commodi perferendis. Possimus incidunt doloremque quos officiis sint quam! Magni commodi saepe id nobis cupiditate, veritatis repudiandae nihil iure quidem ex consequuntur! Exercitationem quibusdam suscipit non placeat dolor excepturi dignissimos temporibus, eveniet vitae ipsum impedit voluptates rem perferendis quis voluptatibus consequuntur sunt sed quasi reiciendis ullam officiis deserunt modi vel iure. Unde alias, dolore architecto expedita doloremque et fugit similique asperiores sint nobis qui recusandae cumque nulla non porro numquam quis dolores magnam nihil. Officiis nihil in et, inventore blanditiis magnam illum odit quibusdam culpa aliquam impedit vero vel nemo, facilis soluta, vitae ut excepturi ipsum aperiam qui deserunt architecto saepe rerum! Aliquam, id iusto cumque odio excepturi fugiat maxime ex voluptatibus quis animi nemo ducimus sequi! Odio quas eveniet nulla! Quasi, facilis voluptas minima voluptatum nam sapiente explicabo error consectetur beatae et numquam cupiditate quos, perspiciatis quam nesciunt nostrum at dolores ullam voluptates rem excepturi necessitatibus mollitia! Perferendis, perspiciatis est officiis, labore natus sapiente molestiae animi illo distinctio magnam totam ipsa minima voluptatem ullam ut magni qui recusandae fugit mollitia corrupti, quasi enim aliquam omnis quibusdam. Libero, amet. Dolores quod repudiandae corporis perspiciatis earum consequatur, explicabo distinctio odio, ad totam debitis repellendus impedit fuga nihil porro mollitia, quia esse ullam adipisci similique soluta illo incidunt ratione! Qui, pariatur natus laudantium aspernatur nostrum, aliquam est minus in deleniti autem, cupiditate molestiae! Consequuntur unde ullam autem quia illo sint, dicta sunt nostrum quas doloribus! Quo dignissimos ratione reiciendis ex laboriosam? Repellendus, reiciendis nobis ab similique tempore eligendi totam voluptate quisquam deleniti vel expedita, accusamus dolor esse reprehenderit consectetur dignissimos deserunt sint est cupiditate, quidem voluptatem. Omnis harum labore laboriosam modi, dignissimos voluptas minima blanditiis maxime, quaerat illo laudantium ipsum hic temporibus consectetur incidunt, iure dicta dolor ullam. Illum modi, nihil mollitia aspernatur facere sint aliquid fugit, asperiores dolores hic minima omnis vitae. Facilis ducimus, tempore explicabo ea sequi fugit eaque perferendis tempora illum asperiores repellat deleniti distinctio dolorem natus nostrum aut amet ipsa molestias eligendi aspernatur aliquid alias rerum quod nobis! Autem laudantium blanditiis rem repellendus cum atque repellat totam vitae sed, necessitatibus dignissimos soluta maiores recusandae corrupti voluptate vel! Cupiditate id, illo eius beatae, quasi voluptatum esse repellendus deserunt sint dicta unde. Consectetur dolor nisi expedita, fugiat quasi blanditiis quaerat vitae quo exercitationem a tenetur nulla voluptatibus, nobis ratione cupiditate eum?',
    },
    {
      username: 'Trần Văn B',
      phone: '0987654321',
      email: 'tvb@gmail.com',
      reportedObject: 'Địa điểm',
      reportType: 'Tố giác sai phạm',
      status: 'Đang xử lý',
      reportContent:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda nostrum dicta distinctio harum non quod natus ipsum ducimus, aliquid enim, nobis labore sapiente ut architecto rerum explicabo culpa nam amet soluta exercitationem! Beatae hic alias quis aliquid ex eligendi vel natus, eveniet ullam possimus, necessitatibus, reiciendis earum dolor? Necessitatibus, ullam.',
    },
    {
      username: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'nva@gmail.com',
      reportedObject: 'Bảng quảng cáo',
      reportType: 'Tố giác sai phạm',
      status: 'Đã xử lý',
      reportContent:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid quidem nobis, modi ducimus impedit itaque facilis nihil enim molestias possimus officiis aspernatur aperiam quam voluptatem nam quos dignissimos voluptate expedita.',
    },
    {
      username: 'Trần Văn B',
      phone: '0987654321',
      email: 'tvb@gmail.com',
      reportedObject: 'Địa điểm',
      reportType: 'Tố giác sai phạm',
      status: 'Không được chấp nhận',
      reportContent:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda nostrum dicta distinctio harum non quod natus ipsum ducimus, aliquid enim, nobis labore sapiente ut architecto rerum explicabo culpa nam amet soluta exercitationem! Beatae hic alias quis aliquid ex eligendi vel natus, eveniet ullam possimus, necessitatibus, reiciendis earum dolor? Necessitatibus, ullam.',
    },
    {
      username: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'nva@gmail.com',
      reportedObject: 'Bảng quảng cáo',
      reportType: 'Tố giác sai phạm',
      status: 'Chờ xử lý',
      reportContent:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita veniam temporibus earum et quis aspernatur quia quos provident eos! Magni dolorum a doloribus delectus quae ipsam enim, nam ipsum, nemo consectetur modi autem tempora incidunt quia nihil sint voluptate molestiae saepe consequatur hic! Repudiandae, ad unde! Voluptatibus facilis eum animi ex voluptates ad impedit dicta quisquam ratione corporis, earum similique harum velit! Dolore repellat minima expedita delectus ipsa dignissimos, molestias reiciendis iste rerum minus recusandae voluptatum unde, doloribus, sed sapiente quia. Reprehenderit alias molestiae cumque sit dolores impedit reiciendis, pariatur architecto doloremque quos officia blanditiis. Quaerat similique magnam ab! Numquam, omnis architecto quo nihil rem ipsum iusto totam minus, vitae adipisci reiciendis dolor doloribus enim, ex odit necessitatibus quae commodi perferendis. Possimus incidunt doloremque quos officiis sint quam! Magni commodi saepe id nobis cupiditate, veritatis repudiandae nihil iure quidem ex consequuntur! Exercitationem quibusdam suscipit non placeat dolor excepturi dignissimos temporibus, eveniet vitae ipsum impedit voluptates rem perferendis quis voluptatibus consequuntur sunt sed quasi reiciendis ullam officiis deserunt modi vel iure. Unde alias, dolore architecto expedita doloremque et fugit similique asperiores sint nobis qui recusandae cumque nulla non porro numquam quis dolores magnam nihil. Officiis nihil in et, inventore blanditiis magnam illum odit quibusdam culpa aliquam impedit vero vel nemo, facilis soluta, vitae ut excepturi ipsum aperiam qui deserunt architecto saepe rerum! Aliquam, id iusto cumque odio excepturi fugiat maxime ex voluptatibus quis animi nemo ducimus sequi! Odio quas eveniet nulla! Quasi, facilis voluptas minima voluptatum nam sapiente explicabo error consectetur beatae et numquam cupiditate quos, perspiciatis quam nesciunt nostrum at dolores ullam voluptates rem excepturi necessitatibus mollitia! Perferendis, perspiciatis est officiis, labore natus sapiente molestiae animi illo distinctio magnam totam ipsa minima voluptatem ullam ut magni qui recusandae fugit mollitia corrupti, quasi enim aliquam omnis quibusdam. Libero, amet. Dolores quod repudiandae corporis perspiciatis earum consequatur, explicabo distinctio odio, ad totam debitis repellendus impedit fuga nihil porro mollitia, quia esse ullam adipisci similique soluta illo incidunt ratione! Qui, pariatur natus laudantium aspernatur nostrum, aliquam est minus in deleniti autem, cupiditate molestiae! Consequuntur unde ullam autem quia illo sint, dicta sunt nostrum quas doloribus! Quo dignissimos ratione reiciendis ex laboriosam? Repellendus, reiciendis nobis ab similique tempore eligendi totam voluptate quisquam deleniti vel expedita, accusamus dolor esse reprehenderit consectetur dignissimos deserunt sint est cupiditate, quidem voluptatem. Omnis harum labore laboriosam modi, dignissimos voluptas minima blanditiis maxime, quaerat illo laudantium ipsum hic temporibus consectetur incidunt, iure dicta dolor ullam. Illum modi, nihil mollitia aspernatur facere sint aliquid fugit, asperiores dolores hic minima omnis vitae. Facilis ducimus, tempore explicabo ea sequi fugit eaque perferendis tempora illum asperiores repellat deleniti distinctio dolorem natus nostrum aut amet ipsa molestias eligendi aspernatur aliquid alias rerum quod nobis! Autem laudantium blanditiis rem repellendus cum atque repellat totam vitae sed, necessitatibus dignissimos soluta maiores recusandae corrupti voluptate vel! Cupiditate id, illo eius beatae, quasi voluptatum esse repellendus deserunt sint dicta unde. Consectetur dolor nisi expedita, fugiat quasi blanditiis quaerat vitae quo exercitationem a tenetur nulla voluptatibus, nobis ratione cupiditate eum?',
    },
    {
      username: 'Trần Văn B',
      phone: '0987654321',
      email: 'tvb@gmail.com',
      reportedObject: 'Địa điểm',
      reportType: 'Tố giác sai phạm',
      status: 'Đang xử lý',
      reportContent:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda nostrum dicta distinctio harum non quod natus ipsum ducimus, aliquid enim, nobis labore sapiente ut architecto rerum explicabo culpa nam amet soluta exercitationem! Beatae hic alias quis aliquid ex eligendi vel natus, eveniet ullam possimus, necessitatibus, reiciendis earum dolor? Necessitatibus, ullam.',
    },
    {
      username: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'nva@gmail.com',
      reportedObject: 'Bảng quảng cáo',
      reportType: 'Tố giác sai phạm',
      status: 'Đã xử lý',
      reportContent:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid quidem nobis, modi ducimus impedit itaque facilis nihil enim molestias possimus officiis aspernatur aperiam quam voluptatem nam quos dignissimos voluptate expedita.',
    },
    {
      username: 'Trần Văn B',
      phone: '0987654321',
      email: 'tvb@gmail.com',
      reportedObject: 'Địa điểm',
      reportType: 'Tố giác sai phạm',
      status: 'Không được chấp nhận',
      reportContent:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda nostrum dicta distinctio harum non quod natus ipsum ducimus, aliquid enim, nobis labore sapiente ut architecto rerum explicabo culpa nam amet soluta exercitationem! Beatae hic alias quis aliquid ex eligendi vel natus, eveniet ullam possimus, necessitatibus, reiciendis earum dolor? Necessitatibus, ullam.',
    },
  ]);

  const [currentReportIndex, setCurrentReportIndex] = useState(0);

  return (
    <div className={classes.main_container}>
      <div className={classes.sideBar_container}>
        <div className={classes.searchBar_container}>
          <a href="/reports" className={[classes.back_btn, classes.btn].join(' ')}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </a>
          <SearchBar placeholder="Tìm kiếm..." width="20rem" onChange={(keyword) => console.log(keyword)} />
        </div>

        <div className={classes.nav_btn_container}>
          <div className={[classes.nav_btn, classes.btn].join(' ')}>
            <FontAwesomeIcon icon={faLocationDot} />
          </div>
          <div className={[classes.nav_btn, classes.btn].join(' ')}>
            <FontAwesomeIcon icon={faCircleInfo} />
          </div>
          <div
            className={[classes.nav_btn, classes.btn, currentReportIndex <= 0 && classes['btn--disabled']].join(' ')}
            onClick={() => setCurrentReportIndex(currentReportIndex - 1)}
          >
            <FontAwesomeIcon icon={faAngleUp} />
          </div>
          <div
            className={[
              classes.nav_btn,
              classes.btn,
              currentReportIndex >= data.length - 1 && classes['btn--disabled'],
            ].join(' ')}
            onClick={() => setCurrentReportIndex(currentReportIndex + 1)}
          >
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
        </div>

        <dir className={classes.reports_container}>
          {data.map((item, index) => (
            <div className={classes.report_item} key={index} onClick={() => setCurrentReportIndex(index)}>
              <dir className={classes.divider} />
              <div className={classes.username}>
                <div
                  className={[
                    classes.username__text,
                    currentReportIndex === index && classes['username__text--active'],
                  ].join(' ')}
                >
                  {index + 1 + '. ' + item.username}
                </div>
                <div
                  className={[
                    classes.username__ic,
                    currentReportIndex === index && classes['username__ic--active'],
                  ].join(' ')}
                >
                  <FontAwesomeIcon icon={faAngleLeft} />
                </div>
              </div>
            </div>
          ))}
        </dir>
      </div>

      <div className={classes.content_container}>
        <div className={classes.title}>
          Chi tiết báo cáo tại 15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM
        </div>

        <div className={classes.userInfo_container}>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td className={classes.userInfo_col}>
                  <div className={classes.itemInfo}>
                    <FontAwesomeIcon icon={faUser} />
                    <dir className={classes.itemInfo__text}>
                      {'Người báo cáo: ' + data[currentReportIndex].username}
                    </dir>
                  </div>
                </td>
                <td className={classes.userInfo_col}>
                  <div className={classes.itemInfo}>
                    <FontAwesomeIcon icon={faFlag} />
                    <dir className={classes.itemInfo__text}>
                      {'Đối tượng bị báo cáo: ' + data[currentReportIndex].reportedObject}
                    </dir>
                  </div>
                </td>
              </tr>
              <tr>
                <td className={classes.userInfo_col}>
                  <div className={classes.itemInfo}>
                    <FontAwesomeIcon icon={faPhone} />
                    <dir className={classes.itemInfo__text}>{'Số điện thoại: ' + data[currentReportIndex].phone}</dir>
                  </div>
                </td>
                <td className={classes.userInfo_col}>
                  <div className={classes.itemInfo}>
                    <FontAwesomeIcon icon={faFile} />
                    <dir className={classes.itemInfo__text}>
                      {'Hình thức báo cáo: ' + data[currentReportIndex].reportType}
                    </dir>
                  </div>
                </td>
              </tr>
              <tr>
                <td className={classes.userInfo_col}>
                  <div className={classes.itemInfo}>
                    <FontAwesomeIcon icon={faEnvelope} />
                    <dir className={classes.itemInfo__text}>{'Email: ' + data[currentReportIndex].email}</dir>
                  </div>
                </td>
                <td className={classes.userInfo_col}>
                  <div className={classes.itemInfo}>
                    <FontAwesomeIcon icon={faDiagramProject} />
                    <dir className={classes.itemInfo__text}>{'Trạng thái: ' + data[currentReportIndex].status}</dir>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={classes.reportContent_container}>{data[currentReportIndex].reportContent}</div>

        <div className={classes.processBtn}>
          <IconTextBtn
            label={
              data[currentReportIndex].status !== 'Đang xử lý' && data[currentReportIndex].status !== 'Đã xử lý'
                ? 'Xử lý'
                : data[currentReportIndex].status
            }
            rightIc={
              data[currentReportIndex].status === 'Đang xử lý'
                ? faHourglassStart
                : data[currentReportIndex].status === 'Đã xử lý'
                ? faCheck
                : faArrowRight
            }
            disabled={
              data[currentReportIndex].status === 'Đang xử lý' || data[currentReportIndex].status === 'Đã xử lý'
            }
            onClick={() => console.log('Xử lý')}
          />
        </div>
      </div>
    </div>
  );
}
