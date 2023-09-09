import { GithubOutlined, CopyrightOutlined, BulbOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

const Footer: React.FC = () => {
  const defaultMessage = 'Jarvlis出品';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={false}
      links={[
        {
          key: 'github',
          title: (
            <>
              <GithubOutlined /> Jarvlis GitHub
            </>
          ),
          href: 'https://github.com/Jarvlis',
          blankTarget: true,
        },
        {
          key: 'juejin',
          title: (
            <>
              <BulbOutlined />
              掘金博客
            </>
          ),
          href: 'https://juejin.cn/user/1676117864879038/posts',
          blankTarget: true,
        },
        {
          key: 'copyright',
          title: (
            <>
              <CopyrightOutlined /> {`${defaultMessage} ${currentYear}`}
            </>
          ),
          href: 'https://juejin.cn/user/1676117864879038/posts',
          blankTarget: true,
        },
        {
          key: 'beian',
          title: '京ICP备2023021615号-1',
          href: 'http://beian.miit.gov.cn/',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
