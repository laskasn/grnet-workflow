package gr.cyberstream.workflow.engine.controller.v2;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import gr.cyberstream.workflow.engine.model.api.ErrorResponse;
import gr.cyberstream.workflow.engine.model.api.WfOwner;
import gr.cyberstream.workflow.engine.model.api.WfUser;
import gr.cyberstream.workflow.engine.service.InternalException;
import gr.cyberstream.workflow.engine.service.InvalidRequestException;
import gr.cyberstream.workflow.engine.service.ProcessService;
import gr.cyberstream.workflow.engine.service.RealmService;

@RestController("realmV2Controller")
@CrossOrigin
@RequestMapping(value = "/api/v2")
public class RealmController {

	final static Logger logger = LoggerFactory.getLogger(RealmController.class);

	@Autowired
	private RealmService realmService;

	@Autowired
	private ProcessService processService;

	/**
	 * Returns all groups
	 * 
	 * @return
	 */
	@RequestMapping(value = "/group", method = RequestMethod.GET)
	public List<WfOwner> getGroups() {

		return realmService.getRealmGroups();
	}

	/**
	 * Returns all user groups
	 * 
	 * @return
	 */
	@RequestMapping(value = "/user/group", method = RequestMethod.GET)
	public List<String> getUserGroups() {

		return realmService.getUserGroups();
	}

	/**
	 * Returns users with the specified id
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/user/{id}", method = RequestMethod.GET)
	public WfUser getUsers(@PathVariable String id) {

		return realmService.getUser(id);
	}

	/**
	 * Returns users having the specified role
	 * 
	 * @param role
	 * @return
	 */
	@RequestMapping(value = "/user/role/{role}", method = RequestMethod.GET)
	public List<WfUser> getUsersByRole(@PathVariable String role) {

		return realmService.getUsersByRole(role);
	}

	/**
	 * Returns users having the specified group and role
	 * 
	 * @param group
	 * @param role
	 * @return
	 */
	@RequestMapping(value = "/user/group/{group}/role/{role}", method = RequestMethod.GET)
	public List<WfUser> getUsersByGrouopAndRole(@PathVariable String group, @PathVariable String role) {

		return realmService.getUsersByGroupAndRole(group, role);
	}

	/**
	 * Returns all users
	 * 
	 * @return
	 */
	@RequestMapping(value = "/user", method = RequestMethod.GET)
	public List<WfUser> getUsers() {

		return realmService.getAllUsers();
	}

	/**
	 * <code>GET: /api/v2/user/process/{processId}/supervisor</code>
	 * 
	 * Gets supervisors by process
	 * 
	 * @param processId
	 * @return
	 * @throws InvalidRequestException
	 */
	@RequestMapping(value = "/user/process/{processId}/supervisor", method = RequestMethod.GET)
	@ResponseBody
	public List<WfUser> getSupervisorsByProcess(@PathVariable int processId) throws InvalidRequestException {

		return processService.getSupervisorsByProcess(processId);
	}

	/**
	 * Syntax error exception handler
	 * 
	 * @param req
	 * @param exception
	 * @return
	 */
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	@ExceptionHandler(InvalidRequestException.class)
	@ResponseBody
	public ErrorResponse handleSyntaxError(HttpServletRequest req, InvalidRequestException exception) {
		logger.error("Request: " + req.getRequestURL() + " raised " + exception);
		return exception.getError();
	}

	/**
	 * Internal server error exception handler
	 * 
	 * @param req
	 * @param exception
	 * @return
	 */
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@ExceptionHandler(InternalException.class)
	@ResponseBody
	public ErrorResponse handleInternalError(HttpServletRequest req, InternalException exception) {
		logger.error("Request: " + req.getRequestURL() + " raised " + exception);
		return exception.getError();
	}
}
