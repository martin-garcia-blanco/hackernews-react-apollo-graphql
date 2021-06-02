import Link from "./Link";
import { gql, useQuery } from "@apollo/client";

export const FEED_QUERY = gql`
  {
    feed {
      id
      url
      description
      postedBy {
        name
      }
      votes {
        id
      }
    }
  }
`;

const LinkList = () => {
  const { data, loading, error } = useQuery(FEED_QUERY);
  return (
    <div>
      {data &&
        data.feed.map((link, index) => (
          <Link link={link} key={link.id} index={index} />
        ))}
    </div>
  );
};
export default LinkList;
