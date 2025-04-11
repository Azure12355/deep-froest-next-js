// src/app/search/detail/[speciesId]/page.tsx
import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faIdCard, faDna, faRulerCombined, faMapMarkedAlt, faTree,
  faExchangeAlt, faShieldAlt, faBookOpen, faBolt, faSitemap, faImages,
  faTags, faCogs, faCheckCircle, faInfoCircle, faAngleRight,
  faHouse,
  // faMicroscope, // 确保如果使用了 fa-microscope，相应的图标已导入
} from '@fortawesome/free-solid-svg-icons';

import styles from './page.module.css';
import sectionStyles from '@/search/detail/components/InfoSection.module.css';
import tagStyles from '@/search/detail/components/Tag.module.css';

import DetailHeader from '@/search/detail/components/DetailHeader';
import InfoSection from '@/search/detail/components/InfoSection';
import Tag from '@/search/detail/components/Tag';
import ImageGallery from '@/search/detail/components/ImageGallery';
import { SpeciesDetailData } from '@/search/detail/types';

// --- Mock Data Fetching Function ---
// (保持不变)
async function fetchSpeciesData(speciesId: string): Promise<SpeciesDetailData | null> {
  console.log(`Fetching data for species ID: ${speciesId}`);
  await new Promise(resolve => setTimeout(resolve, 50));
  if (speciesId === '1') {
     return {
         id: 'sp1-pwn',
         chineseName: '松材线虫',
         scientificName: 'Bursaphelenchus xylophilus',
         authorship: '(Steiner & Buhrer) Nickle',
         status: 'confirmed',
         statusText: '已确认',
         iconClass: 'fa-microscope', // 可以根据这个选择图标

         englishName: 'Pine Wood Nematode',
         englishAbbr: 'PWN',
         taxonomicUnit: '种 (Species)',
         riskCode: 'Risk-High-01',
         guid: 'guid-sp1-pwn',
         description: '一种毁灭性的植物寄生线虫，被列为国际重要的检疫性有害生物。主要侵染松属植物，引起松材线虫病（Pine Wilt Disease, PWD），导致松树快速枯萎死亡。',
         sources: 'EPPO Global Database, CABI Compendium, 中国林业科学研究院',

         biology: {
             properties: '典型的雌雄异体，卵生。生活史包括卵、四个幼虫期（J1-J4）和成虫期。在不利条件下，J2可发育为高抗逆性的扩散型J4（dauerlarva, J4d），该虫态是其通过媒介昆虫传播的主要形式。主要取食寄主木材薄壁细胞和侵入木材的真菌（如蓝变菌）菌丝。在适宜温度（25℃）下，完成一个世代约需4-5天，繁殖速度快。',
             stages: '卵, 幼虫(J1-J4), 成虫',
             visibility: '显微镜可见',
         },

         morphology: {
             characteristics: '虫体微小，长度通常在0.6-1.1毫米之间，细长呈蠕虫状。体表具细环纹。口针发达，基部具明显球结。雌虫尾端形态变异较大，可呈钝圆或尖细状，具明显的阴门瓣。雄虫尾端向腹面弯曲，具发达的交合刺和交合伞。扩散型J4形态独特，体内充满脂类物质。',
             detectionMethods: [
                 '症状诊断: 观察松树针叶萎蔫变色、树脂停止分泌等典型症状。',
                 '线虫分离: 采用贝尔曼漏斗法（Baermann funnel technique）从可疑木材样品中分离线虫。',
                 '形态学鉴定: 在显微镜下观察分离出的线虫形态特征进行鉴定。',
                 '分子检测: 利用PCR（聚合酶链式反应）等分子生物学技术进行快速、准确鉴定，特别是针对特定基因序列的检测。',
             ],
         },

         distribution: {
             description: '该物种被认为起源于北美洲，现已广泛传播至亚洲和欧洲部分地区。其扩散主要受媒介昆虫活动范围和人为调运带疫木材的影响。',
             areas: [
                 { region: '亚洲', locations: ['中国 (多省份)', '日本', '韩国', '朝鲜'] },
                 { region: '北美洲', locations: ['美国', '加拿大', '墨西哥'] },
                 { region: '欧洲', locations: ['葡萄牙', '西班牙'] },
             ],
             statusDescription: '状态描述: 在上述国家的主要松林区为存在(Present)状态，并被严格检疫。',
         },

         host: {
             rangeDescription: '主要危害松属（Pinus）植物，对不同松树种类的易感性存在显著差异。部分非松属植物在实验条件下也可被侵染，但自然条件下主要在松树上完成生活史。',
             hosts: [
                 { name: '赤松', scientificName: 'Pinus densiflora', type: 'primary', category: '自然寄主' },
                 { name: '黑松', scientificName: 'Pinus thunbergii', type: 'primary', category: '自然寄主' },
                 { name: '油松', scientificName: 'Pinus tabuliformis', type: 'primary', category: '自然寄主' },
                 { name: '马尾松', scientificName: 'Pinus massoniana', type: 'primary', category: '自然寄主' },
                 { name: '欧洲赤松', scientificName: 'Pinus sylvestris', type: 'secondary', category: '自然寄主' },
                 { name: '湿地松', scientificName: 'Pinus elliottii', type: 'occasional', category: '实验寄主' },
             ],
             affectedParts: '木质部 (树干、枝条)',
             intensity: '高 (High)',
         },

         transmission: {
             mediums: [
                 { name: '松墨天牛 (Monochamus alternatus)', type: 'Vector', method: '虫媒传播' },
                 { name: '花墨天牛 (Monochamus saltuarius)', type: 'Vector', method: '虫媒传播' },
                 { name: '带疫松木及制品', type: 'Other', method: '人为传播途径' },
             ],
             pathwayDescription: '携带线虫的天牛成虫在补充营养取食健康松树嫩枝时将线虫传入；天牛在衰弱木上产卵时也可引入线虫。人为远距离传播主要是通过未经检疫处理的松木包装箱、电缆盘等松木制品。',
             ecoImpact: '导致松林大面积死亡，破坏森林生态系统结构和功能，影响生物多样性，改变林区景观，并可能引发次生病虫害。对依赖松林的野生动物造成影响。',
         },

         management: {
             summary: '防治策略强调“预防为主，综合治理”，关键在于控制传染源和切断传播途径。',
             methods: [
                 '检疫: 加强进出境及国内调运检疫，防止疫情扩散。',
                 '疫木清理: 及时发现并彻底清除（砍伐、焚烧、削片、或药剂处理）感病松树。',
                 '媒介昆虫防治: 采用诱捕器监测和诱杀天牛，在关键时期进行药剂防治（如飞机防治、地面喷雾），保护天敌。',
                 '预防性措施: 对重点保护区域或高价值松树进行树干注药（如阿维菌素）。',
                 '抗性选育: 选育和种植抗病松树品种。',
                 '监测预警: 建立监测网络，定期普查，实现早期发现、早期预警。',
             ],
             remark: '具体防治措施需根据当地实际情况和法规执行。可参考国家林业和草原局相关防治技术方案。',
         },

         references: [
             { id: 'ref1', title: '松材线虫病研究进展', authors: '叶建仁, 孙江华', source: '林业科学', year: 2010, tags: ['综述', '生物学', '防治'], },
             { id: 'ref2', title: 'Pine Wilt Disease', authors: 'Zhao, B. G., et al. (Eds.)', source: 'Springer Japan', year: 2008, tags: ['专著', '分布', '生物学'], doi: '10.1007/978-4-431-75655-2' },
         ],

         taxonomy: [
             { rank: '界', name: '动物界 (Animalia)' },
             { rank: '门', name: '线虫动物门 (Nematoda)' },
             { rank: '纲', name: '色矛纲 (Chromadorea)' },
             { rank: '目', name: '滑刃目 (Rhabditida)' },
             { rank: '亚目', name: '滑刃亚目 (Tylenchina)' },
             { rank: '科', name: '伞滑刃科 (Aphelenchoididae)' },
             { rank: '属', name: '滑刃属 (Bursaphelenchus)' },
             { rank: '种', name: '松材线虫 (B. xylophilus)', isCurrent: true },
         ],

         images: [
             { id: 'img1', src: 'http://www.pestchina.com/webapi/nb/SpeciesCode/image/info/8d8c3b64-b5a9-492b-9e1b-6cec36b825a5', alt: '松材线虫显微照片', caption: '显微图', type: 'micrograph' },
             { id: 'img2', src: 'http://www.pestchina.com/webapi/nb/SpeciesCode/image/info/0a6d6785-0866-4fc1-b6fe-888e1c72d01d', alt: '松材线虫病危害状', caption: '生态图', type: 'symptom' },
             { id: 'img3', src: 'http://www.pestchina.com/webapi/nb/SpeciesCode/image/info/28c659c5-8f18-47e4-940b-1d43e09195cc', alt: '传播媒介松墨天牛', caption: '媒介图', type: 'vector' },
             { id: 'img4', src: 'http://www.pestchina.com/webapi/nb/SpeciesCode/image/info/e96c4a0c-1f5a-45af-8224-002c6212629e', alt: '树干注药防治', caption: '防治图', type: 'control' },
         ],

         otherNames: [
             { type: '异名(Synonym)', name: 'Aphelenchoides xylophilus Steiner & Buhrer', year: '1934' },
             { type: '曾用名(Old Name)', name: '松树萎蔫病线虫' },
         ],

         metadata: {
             creator: '系统管理员',
             createdAt: '2024-01-15 10:30:00',
             editor: '专家A',
             updatedAt: '2025-04-01 14:25:10',
             reviewer: '专家A',
             reviewedAt: '2024-02-10 09:00:00',
         },
     };
  }
  return null;
}
// --- End of Mock Data ---


// --- Helper Functions ---
// (保持不变)
function getHostTagType(type: 'primary' | 'secondary' | 'occasional'): 'host-primary' | 'host-secondary' | 'host-occasional' {
    return `host-${type}`;
}
function getMediumTagType(type: string): 'medium-vector' | 'medium-other' {
    return type === 'Vector' ? 'medium-vector' : 'medium-other';
}
function getReferenceTagType(tag: string): 'ref-review' | 'ref-book' | 'ref-biology' | 'ref-control' | 'ref-distribution' | 'ref-default' {
    if (tag.includes('综述')) return 'ref-review';
    if (tag.includes('专著')) return 'ref-book';
    if (tag.includes('生物学')) return 'ref-biology';
    if (tag.includes('防治')) return 'ref-control';
    if (tag.includes('分布')) return 'ref-distribution';
    return 'ref-default';
}
// --- End Helper Functions ---


// --- The Page Component ---
// 报错修复：不再使用单独的 `type Props = ...;` 类型别名。
// 将 Props 类型直接定义在函数参数中。
// 这是为了解决 Next.js 内部类型检查器可能存在的对类型别名解析或比较的问题，
// 特别是那个奇怪的“期望 params 是 Promise”的错误。
export default async function SpeciesDetailPage({
  params,
  searchParams // searchParams 仍然可以接收，如果 URL 中有查询参数的话
}: {
  // `params` 对象包含动态路由段的值。
  params: {
    speciesId: string; // 明确 params 包含 speciesId 字符串
  };
  // `searchParams` 对象包含 URL 查询参数。
  searchParams: { [key: string]: string | string[] | undefined }; // 保持 searchParams 的类型定义
}) {
  // 规范化 ID (可以直接使用 params.speciesId)
  const normalizedId = params.speciesId;

  // 获取物种数据
  const speciesData = await fetchSpeciesData(normalizedId);

  // 如果找不到数据，显示提示信息
  if (!speciesData) {
    return (
      <div className={styles.container}>
        <h2>物种未找到</h2>
        <p>抱歉，我们无法找到 ID 为 "{params.speciesId}" 的物种信息。</p>
        <Link href="/search" className={styles.backLink}>
           <FontAwesomeIcon icon={faArrowLeft} /> 返回搜索页面
        </Link>
      </div>
    );
  }

  // 渲染页面内容 (保持不变)
  return (
    <div className={styles.pageContainer}>
        <div className={styles.pageActions}>
             <Link href="/search" className={styles.backLink}>
                <FontAwesomeIcon icon={faArrowLeft} /> 返回搜索结果
            </Link>
         </div>

      <div className={styles.detailContentGrid}>
        <DetailHeader
          chineseName={speciesData.chineseName}
          scientificName={speciesData.scientificName}
          authorship={speciesData.authorship}
          status={speciesData.status}
          statusText={speciesData.statusText}
          // icon={...} // 图标逻辑保持不变
        />

        <div className={styles.mainInfoColumn}>
          <InfoSection title="基本信息" icon={faIdCard}>
            <dl className={`${sectionStyles.infoListInline}`}>
              {speciesData.englishName && <div><dt>英文名称:</dt><dd>{speciesData.englishName}</dd></div>}
              {speciesData.englishAbbr && <div><dt>英文缩写:</dt><dd>{speciesData.englishAbbr}</dd></div>}
              {speciesData.taxonomicUnit && <div><dt>分类单元:</dt><dd>{speciesData.taxonomicUnit}</dd></div>}
              {speciesData.riskCode && <div><dt>风险编码:</dt><dd>{speciesData.riskCode}</dd></div>}
              {speciesData.guid && <div><dt>GUID:</dt><dd>{speciesData.guid}</dd></div>}
            </dl>
            <p>{speciesData.description}</p>
            {speciesData.sources && (
              <div className={sectionStyles.sourceInfo}>
                <strong>数据来源:</strong> {speciesData.sources}
              </div>
            )}
          </InfoSection>

          {/* 其他 Sections 保持不变... */}
          {speciesData.biology && (
            <InfoSection title="生物学特性" icon={faDna}>
              <p>{speciesData.biology.properties}</p>
              <dl className={`${sectionStyles.infoListInline} ${sectionStyles.smallDl}`}>
                {speciesData.biology.stages && <div><dt>主要发育阶段:</dt><dd>{speciesData.biology.stages}</dd></div>}
                {speciesData.biology.visibility && <div><dt>可见性:</dt><dd>{speciesData.biology.visibility}</dd></div>}
              </dl>
            </InfoSection>
          )}

          {speciesData.morphology && (
            <InfoSection title="形态学与检测" icon={faRulerCombined}>
              <p><strong>形态特征:</strong> {speciesData.morphology.characteristics}</p>
              <p><strong>检测方法:</strong></p>
              <ul>
                {speciesData.morphology.detectionMethods.map((method, index) => (
                  <li key={index}>{method}</li>
                ))}
              </ul>
            </InfoSection>
          )}

          {speciesData.distribution && (
             <InfoSection title="地理分布" icon={faMapMarkedAlt}>
                <p>{speciesData.distribution.description}</p>
                <div className={styles.distributionDetails}>
                    <h4>主要分布区域:</h4>
                    {speciesData.distribution.areas.map((area, index) => (
                        <div key={index} className={styles.distributionRegion}>
                            <strong>{area.region}:</strong>
                            <ul>
                                {area.locations.map((loc, locIndex) => <li key={locIndex}>{loc}</li>)}
                            </ul>
                        </div>
                    ))}
                    {speciesData.distribution.statusDescription && <p><em>{speciesData.distribution.statusDescription}</em></p>}
                </div>
                <div className={sectionStyles.mapPlaceholderSmall}>
                    <p><FontAwesomeIcon icon={faMapMarkedAlt} /> 分布地图 (占位)</p>
                </div>
             </InfoSection>
          )}


          {speciesData.host && (
             <InfoSection title="寄主信息" icon={faTree}>
                <p><strong>寄主范围描述:</strong> {speciesData.host.rangeDescription}</p>
                <h4>主要寄主列表:</h4>
                <div className={tagStyles.tagContainer}>
                    {speciesData.host.hosts.map((host, index) => (
                        <Tag
                            key={index}
                            text={`${host.name} (${host.scientificName})`}
                            type={getHostTagType(host.type)}
                            tooltip={`${host.type === 'primary' ? '主要' : host.type === 'secondary' ? '次要' : '偶发'}寄主, ${host.category}`}
                        />
                    ))}
                </div>
                <h4>危害部位与强度:</h4>
                <dl className={`${sectionStyles.infoListInline} ${sectionStyles.smallDl}`}>
                    {speciesData.host.affectedParts && <div><dt>主要危害部位:</dt><dd>{speciesData.host.affectedParts}</dd></div>}
                    {speciesData.host.intensity && <div><dt>侵染强度:</dt><dd>{speciesData.host.intensity}</dd></div>}
                </dl>
             </InfoSection>
          )}

           {speciesData.transmission && (
             <InfoSection title="传播途径与生态影响" icon={faExchangeAlt}>
                <p><strong>主要传播媒介:</strong></p>
                <div className={tagStyles.tagContainer}>
                    {speciesData.transmission.mediums.map((medium, index) => (
                         <Tag
                            key={index}
                            text={medium.name}
                            type={getMediumTagType(medium.type)}
                            tooltip={`${medium.type === 'Vector' ? '传播媒介' : '其他途径'} - ${medium.method}`}
                        />
                    ))}
                </div>
                <p><strong>传播方式描述:</strong> {speciesData.transmission.pathwayDescription}</p>
                <p><strong>潜在生态影响:</strong> {speciesData.transmission.ecoImpact}</p>
             </InfoSection>
          )}

          {speciesData.management && (
              <InfoSection title="管理与防治" icon={faShieldAlt}>
                  <p>{speciesData.management.summary}</p>
                  <h4>主要防治方法:</h4>
                  <ul>
                      {speciesData.management.methods.map((method, index) => <li key={index}>{method}</li>)}
                  </ul>
                  {speciesData.management.remark && (
                      <p className={sectionStyles.remarkInfo}>
                        <FontAwesomeIcon icon={faInfoCircle} /> <strong>备注:</strong> {speciesData.management.remark}
                      </p>
                  )}
              </InfoSection>
          )}

          {speciesData.references && speciesData.references.length > 0 && (
             <InfoSection title="相关文献引用" icon={faBookOpen}>
                <ul className={styles.referenceList}>
                    {speciesData.references.map(ref => (
                        <li key={ref.id}>
                            <p>
                                <strong>{ref.title}</strong> - {ref.authors} {ref.year ? `(${ref.year})` : ''} <i>{ref.source}</i>
                            </p>
                            <div className={tagStyles.tagContainer}>
                                {ref.tags.map((tag, index) => <Tag key={index} text={tag} type={getReferenceTagType(tag)} />)}
                            </div>
                            {ref.doi && <span className={styles.doiInfo}>DOI: <a href={`https://doi.org/${ref.doi}`} target="_blank" rel="noopener noreferrer">{ref.doi}</a></span>}
                            {ref.link && <Link href={ref.link} target="_blank" className={styles.refLink}><FontAwesomeIcon icon={faAngleRight} /> 查看链接</Link>}
                        </li>
                    ))}
                </ul>
             </InfoSection>
          )}
        </div>

        <aside className={styles.sideInfoColumn}>
            <InfoSection title="快速概览" icon={faBolt} className={styles.stickyCard}>
                <dl className={styles.quickFactsList}>
                    <div><dt><FontAwesomeIcon icon={faSitemap} />主要分类:</dt><dd>线虫动物门 (Nematoda)</dd></div>
                    {speciesData.taxonomicUnit && <div><dt><FontAwesomeIcon icon={faTags} />分类层级:</dt><dd>{speciesData.taxonomicUnit}</dd></div>}
                    <div>
                      <dt><FontAwesomeIcon icon={faCheckCircle} />确认状态:</dt>
                      <dd className={`${styles.statusText} ${styles['status'+speciesData.status.charAt(0).toUpperCase() + speciesData.status.slice(1)]}`}>
                        {speciesData.statusText}
                      </dd>
                    </div>
                    {speciesData.transmission && <div><dt><FontAwesomeIcon icon={faExchangeAlt} />主要传播:</dt><dd>{speciesData.transmission.mediums.slice(0, 2).map(m => m.name).join(', ')}</dd></div>}
                    {speciesData.host && <div><dt><FontAwesomeIcon icon={faTree} />主要寄主:</dt><dd>松属植物 (Pinus spp.)</dd></div>}
                    {speciesData.management && <div><dt><FontAwesomeIcon icon={faShieldAlt} />核心防治:</dt><dd>疫木清理, 媒介控制</dd></div>}
                </dl>
            </InfoSection>

            {speciesData.taxonomy && speciesData.taxonomy.length > 0 && (
                 <InfoSection title="分类地位" icon={faSitemap} className={styles.stickyCard}>
                     <ul className={`${sectionStyles.compactList} ${styles.taxonomyList}`}>
                         {speciesData.taxonomy.map((taxon, index) => (
                             <li key={index} className={taxon.isCurrent ? styles.currentTaxon : ''}>
                                 {taxon.rank}: {taxon.name.includes('(') ? (
                                     <>
                                         {taxon.name.split('(')[0].trim()} (<i>{taxon.name.split('(')[1].replace(')', '').trim()}</i>)
                                     </>
                                 ) : (
                                     taxon.name
                                 )}
                             </li>
                         ))}
                     </ul>
                 </InfoSection>
            )}

            {speciesData.images && speciesData.images.length > 0 && (
                <InfoSection title="相关图片" icon={faImages} className={styles.stickyCard}>
                    <ImageGallery images={speciesData.images} />
                </InfoSection>
            )}

           {speciesData.otherNames && speciesData.otherNames.length > 0 && (
                <InfoSection title="其他名称" icon={faTags}>
                    <ul className={`${sectionStyles.compactList} ${sectionStyles.otherNamesList}`}>
                         {speciesData.otherNames.map((name, index) => (
                             <li key={index}>
                                 <span className={sectionStyles.nameType}>{name.type}:</span>
                                 <span className={sectionStyles.otherName}>{name.name}</span>
                                 {name.year && <span className={sectionStyles.namedYear}>({name.year})</span>}
                             </li>
                         ))}
                     </ul>
                </InfoSection>
           )}

            {speciesData.metadata && (
                <InfoSection title="元数据" icon={faCogs}>
                    <dl className={sectionStyles.metadataList}>
                        <div><dt>创建者:</dt><dd>{speciesData.metadata.creator}</dd></div>
                        <div><dt>创建时间:</dt><dd>{speciesData.metadata.createdAt}</dd></div>
                        {speciesData.metadata.editor && <div><dt>最后编辑者:</dt><dd>{speciesData.metadata.editor}</dd></div>}
                        {speciesData.metadata.updatedAt && <div><dt>更新时间:</dt><dd>{speciesData.metadata.updatedAt}</dd></div>}
                         {speciesData.metadata.reviewer && <div><dt>审核人:</dt><dd>{speciesData.metadata.reviewer}</dd></div>}
                         {speciesData.metadata.reviewedAt && <div><dt>审核时间:</dt><dd>{speciesData.metadata.reviewedAt}</dd></div>}
                    </dl>
                </InfoSection>
            )}
        </aside>
      </div>
    </div>
  );
}