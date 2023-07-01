from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import service_pb2_grpc, resources_pb2, service_pb2
from clarifai_grpc.grpc.api.status import status_code_pb2
from google.protobuf.json_format import MessageToJson

from dotenv import load_dotenv
import os

load_dotenv()


class ApiBrain:
    def __init__(self) -> None:
        self.stub = service_pb2_grpc.V2Stub(ClarifaiChannel.get_grpc_channel())

        # Your PAT (Personal Access Token) can be found in the portal under Authentification
        self.PAT = os.getenv('CLARIFAI_PAT')
        # Specify the correct user_id/app_id pairings
        # Since you're making inferences outside your app's scope
        self.USER_ID = os.getenv('USER_ID')
        self.APP_ID = os.getenv('APP_ID')
        # Change these to whatever model and image URL you want to use
        self.MODEL_ID = os.getenv('MODEL_ID')

        # This is how you authenticate.
        self.metadata = (("authorization", f"Key {self.PAT}"),)

    def make_api_call(self, url):
        user_data_object = resources_pb2.UserAppIDSet(user_id=self.USER_ID, app_id=self.APP_ID)
        post_model_outputs_response = self.stub.PostModelOutputs(
            service_pb2.PostModelOutputsRequest(
                user_app_id=user_data_object,
                # The userDataObject is created in the overview and is required when using a PAT
                model_id=self.MODEL_ID,
                # version_id=MODEL_VERSION_ID,  # This is optional. Defaults to the latest model version
                inputs=[
                    resources_pb2.Input(
                        data=resources_pb2.Data(
                            image=resources_pb2.Image(
                                url=url
                            )
                        )
                    )
                ]
            ),
            metadata=self.metadata
        )
        if post_model_outputs_response.status.code != status_code_pb2.SUCCESS:
            print(post_model_outputs_response.status)
            raise Exception("Post model outputs failed, status: " + post_model_outputs_response.status.description)

        # Since we have one input, one output will exist here
        output = post_model_outputs_response.outputs[0]

        print("Predicted concepts:")
        for concept in output.data.concepts:
            print("%s %.2f" % (concept.name, concept.value))

        boxes_data = output.data.regions

        if len(boxes_data) == 1:
            box = output.data.regions[0].region_info.bounding_box
            return MessageToJson(box)
        else:
            data_list = []
            for n in range(0, len(boxes_data)):
                box = output.data.regions[n].region_info.bounding_box
                json_obj = MessageToJson(box)
                data_list.append(json_obj)

            return data_list
