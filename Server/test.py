from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import service_pb2_grpc, resources_pb2, service_pb2
from clarifai_grpc.grpc.api.status import status_code_pb2
from dotenv import load_dotenv
import os

# Load variables from .env file
load_dotenv()

stub = service_pb2_grpc.V2Stub(ClarifaiChannel.get_grpc_channel())

# Your PAT (Personal Access Token) can be found in the portal under Authentification
PAT = os.getenv('CLARIFAI_PAT')
# Specify the correct user_id/app_id pairings
# Since you're making inferences outside your app's scope
USER_ID = os.getenv('USER_ID')
APP_ID = os.getenv('APP_ID')
# Change these to whatever model and image URL you want to use
MODEL_ID = os.getenv('MODEL_ID')

# This is how you authenticate.
metadata = (("authorization", f"Key {PAT}"),)

user_data_object = resources_pb2.UserAppIDSet(user_id=USER_ID, app_id=APP_ID)
post_model_outputs_response = stub.PostModelOutputs(
    service_pb2.PostModelOutputsRequest(
        user_app_id=user_data_object,
        # The userDataObject is created in the overview and is required when using a PAT
        model_id=MODEL_ID,
        # version_id=MODEL_VERSION_ID,  # This is optional. Defaults to the latest model version
        inputs=[
            resources_pb2.Input(
                data=resources_pb2.Data(
                    image=resources_pb2.Image(
                        url='https://upload.wikimedia.org/wikipedia/commons/a/a9/Tom_Hanks_TIFF_2019.jpg'
                    )
                )
            )
        ]
    ),
    metadata=metadata
)
if post_model_outputs_response.status.code != status_code_pb2.SUCCESS:
    print(post_model_outputs_response.status)
    raise Exception("Post model outputs failed, status: " + post_model_outputs_response.status.description)

# Since we have one input, one output will exist here
output = post_model_outputs_response.outputs[0]

print("Predicted concepts:")
for concept in output.data.concepts:
    print("%s %.2f" % (concept.name, concept.value))

# Uncomment this line to print the full Response JSON
print(output.id)


