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

const NEW_LINK_SUBSCRIPTIONS = gql`
  subscription {
    newLink {
      id
      url
      description
      votes {
        id
      }
    }
  }
`;

const NEW_VOTES_SUBSCRIPTIONS = gql`
  subscription {
    newVote {
      id
      link {
        id
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

const LinkList = () => {
  const { data, loading, error, subscribeToMore } = useQuery(FEED_QUERY);
  subscribeToMore({ document: NEW_VOTES_SUBSCRIPTIONS });
  subscribeToMore({
    document: NEW_LINK_SUBSCRIPTIONS,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const newLink = subscriptionData.data.newLink;
      const exist = prev.feed.find(({ id }) => id === newLink.id);
      if (exist) return prev;

      return Object.assign({}, prev, { feed: [newLink, ...prev.feed] });
    },
  });
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
