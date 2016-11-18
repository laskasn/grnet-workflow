package gr.cyberstream.workflow.engine.customtypes;

import java.io.IOException;
import java.io.Serializable;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ApproveType implements Serializable {

	private static final long serialVersionUID = -2185927338061726103L;

	private boolean approve;

	public ApproveType() {
	}

	public ApproveType(boolean approve) {
		this.approve = approve;
	}

	public boolean isApprove() {
		return approve;
	}

	public void setApprove(boolean approve) {
		this.approve = approve;
	}

	public String toString() {

		ObjectMapper mapper = new ObjectMapper();

		String jsonSerialization = "";

		try {
			jsonSerialization = mapper.writeValueAsString(this);

		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		return jsonSerialization;
	}

	/**
	 * Return a new ApproveType Object de-serializing a JSon representation
	 * 
	 * @param jsonSerialization
	 *            The serialized string
	 * @return
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	public static ApproveType fromString(String jsonSerialization) throws JsonParseException, JsonMappingException, IOException {

		// de-serialize JSon representation
		ObjectMapper mapper = new ObjectMapper();
		ApproveType approve = mapper.readValue(jsonSerialization, ApproveType.class);

		return approve;
	}
}
