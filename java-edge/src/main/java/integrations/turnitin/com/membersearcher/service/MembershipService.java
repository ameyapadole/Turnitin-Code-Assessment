package integrations.turnitin.com.membersearcher.service;

import java.util.concurrent.CompletableFuture;

import integrations.turnitin.com.membersearcher.client.MembershipBackendClient;
import integrations.turnitin.com.membersearcher.model.MembershipList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class MembershipService {
	@Autowired
	private MembershipBackendClient membershipBackendClient;

	/**
	 * Method to fetch all memberships with their associated user details included.
	 * This method calls out to the php-backend service and fetches all memberships,
	 * it then calls to fetch the user details for each user individually and
	 * associates them with their corresponding membership.
	 *
	 * @return A CompletableFuture containing a fully populated MembershipList object.
	 * 
	 * Here the code now users fetchUsers() method to fetch all users in a single API call.
	 * We then populate the list of users in the MembershipList object.
	 * 
	 */

	public CompletableFuture<MembershipList> fetchAllMembershipsWithUsers() {
		return membershipBackendClient.fetchMemberships()
				.thenCompose(members -> membershipBackendClient.fetchUsers()
							.thenApply(userList -> {
								members.getMemberships().forEach(membership -> {
									membership.setUser(userList.getUsers().stream()
											.filter(user -> user.getId().equals(membership.getUserId()))
											.findFirst()
											.orElse(null));
								});
								return members;
							}));
						}
}

	
