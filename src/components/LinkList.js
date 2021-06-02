import Link from "./Link";
import { gql, useQuery } from "@apollo/client";

const FEED_QUERY = gql`
  {
    feed {
      id
      url
      description
    }
  }
`;

const LinkList = () => {
  const { data, loading, error } = useQuery(FEED_QUERY);
  return (
    <div>
      {data && data.feed.map((link) => <Link link={link} key={link.id} />)}
    </div>
  );
};
export default LinkList;
