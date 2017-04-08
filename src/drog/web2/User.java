package drog.web2;

public class User {
	private Integer id_user;
	private Integer id_role;
	
	public User(Integer id_user, Integer id_role, String name, String email) {
		this.id_user = id_user;
		this.id_role = id_role;
		this.name = name;
		this.email = email;
	}

	private String name;
	private String email;
	
	public Integer getUserId() {
		return id_user;
	}
	
	public void setUserId(Integer id_user) {
		this.id_user = id_user;
	}
	
	public Integer getRoleId() {
		return id_role;
	}
	
	public void setRoleId(Integer id_role) {
		this.id_role = id_role;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getEmail() {
		return email;
	}
	
	public void setEmail(String email) {
		this.email = email;
	}
	
}
